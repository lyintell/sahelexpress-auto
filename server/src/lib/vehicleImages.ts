import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { supabaseAdmin } from "./supabase.js";

export const vehicleImageFieldKeys = [
  "image",
  "image_2",
  "image_3",
  "image_4",
  "image_5",
  "image_6",
  "image_7",
  "image_8",
  "image_9",
  "image_10",
] as const;

export type VehicleImageFieldKey = (typeof vehicleImageFieldKeys)[number];

export type VehicleImagePayload = Partial<Record<VehicleImageFieldKey, string | null | undefined>>;

type UploadedVehicleImage = {
  publicUrl: string;
  storagePath: string;
};

let vehicleImagesBucketReadyPromise: Promise<void> | null = null;

export function isDataImageUrl(value: string | null | undefined) {
  return typeof value === "string" && value.trim().startsWith("data:image/");
}

function getImageExtension(contentType: string) {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    case "image/avif":
      return "avif";
    case "image/svg+xml":
      return "svg";
    default:
      throw new Error(`Type d'image non pris en charge: ${contentType}`);
  }
}

function parseDataImageUrl(dataUrl: string) {
  const trimmedDataUrl = dataUrl.trim();
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/u.exec(trimmedDataUrl);

  if (!match) {
    throw new Error("Format d'image invalide pour l'envoi vers le stockage.");
  }

  const [, contentType, base64Payload] = match;

  return {
    contentType,
    buffer: Buffer.from(base64Payload, "base64"),
    extension: getImageExtension(contentType),
  };
}

export async function ensureVehicleImagesBucket() {
  if (!vehicleImagesBucketReadyPromise) {
    vehicleImagesBucketReadyPromise = (async () => {
      const bucketsResult = await supabaseAdmin.storage.listBuckets();

      if (bucketsResult.error) {
        throw new Error(bucketsResult.error.message);
      }

      const existingBucket = bucketsResult.data.find((bucket) => bucket.name === env.SUPABASE_VEHICLE_IMAGES_BUCKET);

      if (!existingBucket) {
        const createBucketResult = await supabaseAdmin.storage.createBucket(env.SUPABASE_VEHICLE_IMAGES_BUCKET, {
          public: true,
          fileSizeLimit: 10 * 1024 * 1024,
          allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"],
        });

        if (createBucketResult.error) {
          throw new Error(createBucketResult.error.message);
        }

        return;
      }

      if (!existingBucket.public) {
        const updateBucketResult = await supabaseAdmin.storage.updateBucket(env.SUPABASE_VEHICLE_IMAGES_BUCKET, {
          public: true,
          fileSizeLimit: 10 * 1024 * 1024,
          allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"],
        });

        if (updateBucketResult.error) {
          throw new Error(updateBucketResult.error.message);
        }
      }
    })();
  }

  return vehicleImagesBucketReadyPromise;
}

async function uploadVehicleImage(fieldKey: VehicleImageFieldKey, value: string) {
  await ensureVehicleImagesBucket();

  const { buffer, contentType, extension } = parseDataImageUrl(value);
  const storagePath = `vehicules/${fieldKey}/${Date.now()}-${randomUUID()}.${extension}`;
  const uploadResult = await supabaseAdmin.storage.from(env.SUPABASE_VEHICLE_IMAGES_BUCKET).upload(storagePath, buffer, {
    contentType,
    upsert: false,
  });

  if (uploadResult.error) {
    throw new Error(uploadResult.error.message);
  }

  const publicUrlResult = supabaseAdmin.storage.from(env.SUPABASE_VEHICLE_IMAGES_BUCKET).getPublicUrl(storagePath);

  return {
    publicUrl: publicUrlResult.data.publicUrl,
    storagePath,
  } satisfies UploadedVehicleImage;
}

export function getStoragePathFromPublicUrl(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || !trimmedValue.startsWith(env.SUPABASE_URL)) {
    return null;
  }

  const expectedPrefix = `${env.SUPABASE_URL}/storage/v1/object/public/${env.SUPABASE_VEHICLE_IMAGES_BUCKET}/`;

  if (!trimmedValue.startsWith(expectedPrefix)) {
    return null;
  }

  return trimmedValue.slice(expectedPrefix.length);
}

export async function removeVehicleStorageObjects(paths: string[]) {
  const uniquePaths = [...new Set(paths.filter(Boolean))];

  if (!uniquePaths.length) {
    return;
  }

  await ensureVehicleImagesBucket();
  const result = await supabaseAdmin.storage.from(env.SUPABASE_VEHICLE_IMAGES_BUCKET).remove(uniquePaths);

  if (result.error) {
    throw new Error(result.error.message);
  }
}

export async function resolveVehicleImagePayload<T extends VehicleImagePayload>(
  payload: T,
  existingVehicle?: Record<string, unknown> | null,
) {
  const nextPayload: T = { ...payload };
  const uploadedPaths: string[] = [];
  const replacedPaths: string[] = [];

  for (const fieldKey of vehicleImageFieldKeys) {
    const rawValue = payload[fieldKey];

    if (typeof rawValue === "undefined") {
      continue;
    }

    if (rawValue === null) {
      nextPayload[fieldKey] = null;

      const previousPath = getStoragePathFromPublicUrl(existingVehicle?.[fieldKey]);

      if (previousPath) {
        replacedPaths.push(previousPath);
      }

      continue;
    }

    const trimmedValue = rawValue.trim();

    if (!trimmedValue) {
      nextPayload[fieldKey] = null;

      const previousPath = getStoragePathFromPublicUrl(existingVehicle?.[fieldKey]);

      if (previousPath) {
        replacedPaths.push(previousPath);
      }

      continue;
    }

    if (!isDataImageUrl(trimmedValue)) {
      nextPayload[fieldKey] = trimmedValue;
      continue;
    }

    const uploadedImage = await uploadVehicleImage(fieldKey, trimmedValue);
    nextPayload[fieldKey] = uploadedImage.publicUrl;
    uploadedPaths.push(uploadedImage.storagePath);

    const previousPath = getStoragePathFromPublicUrl(existingVehicle?.[fieldKey]);

    if (previousPath) {
      replacedPaths.push(previousPath);
    }
  }

  return {
    nextPayload,
    uploadedPaths,
    replacedPaths,
  };
}