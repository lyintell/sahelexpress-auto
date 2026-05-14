import { supabaseAdmin } from "../lib/supabase.js";
import {
  isDataImageUrl,
  removeVehicleStorageObjects,
  resolveVehicleImagePayload,
  vehicleImageFieldKeys,
} from "../lib/vehicleImages.js";

type VehicleImageRow = {
  id: number;
} & Partial<Record<(typeof vehicleImageFieldKeys)[number], string | null>>;

function hasLegacyVehicleImages(vehicle: VehicleImageRow) {
  return vehicleImageFieldKeys.some((fieldKey) => isDataImageUrl(vehicle[fieldKey]));
}

async function migrateVehicle(vehicle: VehicleImageRow) {
  const { nextPayload, uploadedPaths, replacedPaths } = await resolveVehicleImagePayload(vehicle, vehicle);
  const updatePayload = Object.fromEntries(
    vehicleImageFieldKeys.map((fieldKey) => [fieldKey, nextPayload[fieldKey] ?? null]),
  );

  const result = await supabaseAdmin
    .from("vehicules")
    .update(updatePayload)
    .eq("id", vehicle.id)
    .select("id")
    .maybeSingle();

  if (result.error || !result.data) {
    try {
      await removeVehicleStorageObjects(uploadedPaths);
    } catch {
      // Ignore storage cleanup failure after a database error.
    }

    throw new Error(result.error?.message || `Impossible de mettre à jour le véhicule ${vehicle.id}.`);
  }

  try {
    await removeVehicleStorageObjects(replacedPaths);
  } catch {
    // Ignore cleanup failure once the database update succeeded.
  }
}

async function main() {
  const selectFields = ["id", ...vehicleImageFieldKeys].join(", ");
  const result = await supabaseAdmin.from("vehicules").select(selectFields).order("id", { ascending: true });

  if (result.error) {
    throw new Error(result.error.message);
  }

  const vehicles = (result.data ?? []) as unknown as VehicleImageRow[];
  const legacyVehicles = vehicles.filter(hasLegacyVehicleImages);

  console.log(`Véhicules analysés: ${vehicles.length}`);
  console.log(`Véhicules à migrer: ${legacyVehicles.length}`);

  let migratedCount = 0;
  let failureCount = 0;

  for (const vehicle of legacyVehicles) {
    try {
      await migrateVehicle(vehicle);
      migratedCount += 1;
      console.log(`Migré: véhicule #${vehicle.id}`);
    } catch (error) {
      failureCount += 1;
      console.error(`Échec: véhicule #${vehicle.id}`);
      console.error(error instanceof Error ? error.message : error);
    }
  }

  console.log(`Migration terminée. Succès: ${migratedCount}. Échecs: ${failureCount}.`);

  if (failureCount > 0) {
    process.exitCode = 1;
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});