import { Router } from "express";
import { createHash } from "node:crypto";
import { z } from "zod";
import { supabaseAdmin } from "../lib/supabase.js";
import {
  getStoragePathFromPublicUrl,
  removeVehicleStorageObjects,
  resolveVehicleImagePayload,
  vehicleImageFieldKeys,
  type VehicleImagePayload,
} from "../lib/vehicleImages.js";

export const adminRouter = Router();

const idSchema = z.coerce.number().int().positive();

const sessionSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const profileSchema = z.object({
  nom: z.string().min(1),
  tel: z.string().min(1),
  email: z.string().email(),
  type_utilisateur: z.enum(["Admin", "Editeur"]),
  mot_de_passe: z.string().min(1).optional(),
});

const createUserSchema = z.object({
  nom: z.string().trim().min(1),
  tel: z.string().trim().min(1),
  email: z.string().email(),
  type_utilisateur: z.enum(["Admin", "Editeur"]).default("Editeur"),
  mot_de_passe: z.string().min(1),
});

const brandSchema = z.object({
  nom: z.string().trim().min(1),
});

const modelSchema = z.object({
  nom: z.string().trim().min(1),
  marque_id: idSchema,
});

const heroContentSchema = z.object({
  title: z.string().trim().min(1),
  image: z.string().trim(),
});

const contactDetailsSchema = z.object({
  phone: z.string().trim().min(1),
  email: z.string().email(),
  location: z.string().trim().min(1),
});

const optionalVehicleTextSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === null || value === undefined) {
      return null;
    }

    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : null;
  });

const optionalVehicleNumberSchema = z
  .union([z.coerce.number().int().nonnegative(), z.null(), z.literal(""), z.undefined()])
  .transform((value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return value;
  });

const featuredFlagSchema = z.union([z.boolean(), z.enum(["oui", "non"])]);

const vehicleCreateSchema = z.object({
  nom: z.string().trim().min(1),
  model_id: idSchema,
  annee: z.coerce.number().int().min(1900).max(2100),
  couleur: z.string().trim().min(1),
  type_carb: z.enum(["essence", "gasoil"]),
  type_transm: z.enum(["auto", "manuel"]),
  type_moteur: z.enum(["8 cyl", "6 cyl", "4 cyl", "hybrid"]),
  kilometrage: optionalVehicleNumberSchema.optional(),
  prix_vente: optionalVehicleNumberSchema.optional(),
  prix_achat: optionalVehicleNumberSchema.optional(),
  montant_transport: optionalVehicleNumberSchema.optional(),
  montant_dedouanement: optionalVehicleNumberSchema.optional(),
  description: optionalVehicleTextSchema.optional(),
  ind_en_vedette: featuredFlagSchema.optional(),
  ind_etat: z.enum(["disponible", "non-disponible", "vendu"]),
  ajoute_par: idSchema.optional(),
  image: z.string().trim().min(1),
  image_2: optionalVehicleTextSchema.optional(),
  image_3: optionalVehicleTextSchema.optional(),
  image_4: optionalVehicleTextSchema.optional(),
  image_5: optionalVehicleTextSchema.optional(),
  image_6: optionalVehicleTextSchema.optional(),
  image_7: optionalVehicleTextSchema.optional(),
  image_8: optionalVehicleTextSchema.optional(),
  image_9: optionalVehicleTextSchema.optional(),
  image_10: optionalVehicleTextSchema.optional(),
});

const vehicleUpdateSchema = vehicleCreateSchema.partial().extend({
  modifie_par: idSchema.nullable().optional(),
});

type SanitizedUser = {
  id: number;
  nom: string;
  tel: string;
  email: string;
  type_utilisateur: "Admin" | "Editeur";
};

type VehicleRelationsError = {
  status: number;
  message: string;
};

type VehicleRelationsSuccess = {
  model: {
    id: number;
    nom: string;
    marque_id: number;
  };
  brand: {
    id: number;
    nom: string;
  };
};

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

function sanitizeUser(user: SanitizedUser) {
  return {
    id: user.id,
    nom: user.nom,
    tel: user.tel,
    email: user.email,
    type_utilisateur: user.type_utilisateur,
  };
}

function parseIdParam(rawId: string) {
  return idSchema.parse(rawId);
}

function normalizeFeaturedFlag(value: boolean | "oui" | "non" | undefined) {
  if (value === undefined) {
    return true;
  }

  return value === true || value === "oui";
}

async function loadVehicleRelations(
  modelId: number,
): Promise<VehicleRelationsError | VehicleRelationsSuccess> {
  const modelResult = await supabaseAdmin
    .from("modeles")
    .select("id, nom, marque_id")
    .eq("id", modelId)
    .maybeSingle();

  if (modelResult.error) {
    return { status: 500 as const, message: modelResult.error.message };
  }

  if (!modelResult.data) {
    return { status: 404 as const, message: "Modèle introuvable." };
  }

  const brandResult = await supabaseAdmin
    .from("marques")
    .select("id, nom")
    .eq("id", modelResult.data.marque_id)
    .maybeSingle();

  if (brandResult.error) {
    return { status: 500 as const, message: brandResult.error.message };
  }

  if (!brandResult.data) {
    return { status: 404 as const, message: "Marque liée au modèle introuvable." };
  }

  return {
    model: modelResult.data,
    brand: brandResult.data,
  };
}

function hasVehicleRelations(
  relations: VehicleRelationsError | VehicleRelationsSuccess,
): relations is VehicleRelationsSuccess {
  return "model" in relations && "brand" in relations;
}

adminRouter.post("/admin/session", async (request, response, next) => {
  try {
    const payload = sessionSchema.parse(request.body);
    const normalizedEmail = payload.email.trim().toLowerCase();
    const passwordHash = hashPassword(payload.password);

    const existingUserResult = await supabaseAdmin
      .from("users")
      .select("id, nom, tel, email, type_utilisateur, mot_de_passe_hash")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingUserResult.error) {
      return response.status(500).json({ message: existingUserResult.error.message });
    }

    if (!existingUserResult.data) {
      return response.status(403).json({
        message: "Accès refusé. Ce profil éditeur n'existe pas dans la base.",
      });
    }

    if (existingUserResult.data.mot_de_passe_hash && existingUserResult.data.mot_de_passe_hash !== passwordHash) {
      return response.status(401).json({ message: "Email ou mot de passe invalide." });
    }

    if (!existingUserResult.data.mot_de_passe_hash) {
      const updatedUserResult = await supabaseAdmin
        .from("users")
        .update({ mot_de_passe_hash: passwordHash })
        .eq("id", existingUserResult.data.id)
        .select("id, nom, tel, email, type_utilisateur")
        .maybeSingle();

      if (updatedUserResult.error) {
        return response.status(500).json({ message: updatedUserResult.error.message });
      }

      if (!updatedUserResult.data) {
        return response.status(500).json({ message: "Utilisateur mis à jour mais introuvable dans la réponse." });
      }

      return response.json(sanitizeUser(updatedUserResult.data));
    }

    return response.json(sanitizeUser(existingUserResult.data));
  } catch (error) {
    return next(error);
  }
});

adminRouter.post("/admin/users", async (request, response, next) => {
  try {
    const payload = createUserSchema.parse(request.body);
    const normalizedEmail = payload.email.trim().toLowerCase();

    const existingUserResult = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingUserResult.error) {
      return response.status(500).json({ message: existingUserResult.error.message });
    }

    if (existingUserResult.data) {
      return response.status(409).json({ message: "Un utilisateur avec cet email existe déjà." });
    }

    const insertedUserResult = await supabaseAdmin
      .from("users")
      .insert({
        nom: payload.nom.trim(),
        tel: payload.tel.trim(),
        email: normalizedEmail,
        type_utilisateur: payload.type_utilisateur,
        mot_de_passe_hash: hashPassword(payload.mot_de_passe),
      })
      .select("id, nom, tel, email, type_utilisateur")
      .maybeSingle();

    if (insertedUserResult.error) {
      return response.status(500).json({ message: insertedUserResult.error.message });
    }

    if (!insertedUserResult.data) {
      return response.status(500).json({ message: "Utilisateur créé mais introuvable dans la réponse." });
    }

    return response.status(201).json(sanitizeUser(insertedUserResult.data));
  } catch (error) {
    return next(error);
  }
});

adminRouter.get("/admin/users/:id", async (request, response, next) => {
  try {
    const userId = parseIdParam(request.params.id);
    const result = await supabaseAdmin
      .from("users")
      .select("id, nom, tel, email, type_utilisateur")
      .eq("id", userId)
      .maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Utilisateur introuvable." });
    }

    return response.json(sanitizeUser(result.data));
  } catch (error) {
    return next(error);
  }
});

adminRouter.patch("/admin/users/:id", async (request, response, next) => {
  try {
    const userId = parseIdParam(request.params.id);
    const payload = profileSchema.parse(request.body);
    const updatePayload = {
      nom: payload.nom.trim(),
      tel: payload.tel.trim(),
      email: payload.email.trim().toLowerCase(),
      type_utilisateur: payload.type_utilisateur,
      ...(payload.mot_de_passe ? { mot_de_passe_hash: hashPassword(payload.mot_de_passe) } : {}),
    };
    const result = await supabaseAdmin
      .from("users")
      .update(updatePayload)
      .eq("id", userId)
      .select("id, nom, tel, email, type_utilisateur")
      .maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Utilisateur introuvable." });
    }

    return response.json(sanitizeUser(result.data));
  } catch (error) {
    return next(error);
  }
});

adminRouter.get("/admin/marques", async (_request, response, next) => {
  try {
    const result = await supabaseAdmin.from("marques").select("*").order("nom");

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    return response.json(result.data ?? []);
  } catch (error) {
    return next(error);
  }
});

adminRouter.get("/admin/marques/:id", async (request, response, next) => {
  try {
    const brandId = parseIdParam(request.params.id);
    const result = await supabaseAdmin.from("marques").select("*").eq("id", brandId).maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Marque introuvable." });
    }

    return response.json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.post("/admin/marques", async (request, response, next) => {
  try {
    const payload = brandSchema.parse(request.body);
    const result = await supabaseAdmin.from("marques").insert({ nom: payload.nom }).select("*").maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(500).json({ message: "Marque créée mais introuvable dans la réponse." });
    }

    return response.status(201).json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.patch("/admin/marques/:id", async (request, response, next) => {
  try {
    const brandId = parseIdParam(request.params.id);
    const payload = brandSchema.parse(request.body);
    const result = await supabaseAdmin
      .from("marques")
      .update({ nom: payload.nom })
      .eq("id", brandId)
      .select("*")
      .maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Marque introuvable." });
    }

    return response.json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.delete("/admin/marques/:id", async (request, response, next) => {
  try {
    const brandId = parseIdParam(request.params.id);
    const result = await supabaseAdmin.from("marques").delete().eq("id", brandId).select("id").maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Marque introuvable." });
    }

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
});

adminRouter.get("/admin/modeles", async (_request, response, next) => {
  try {
    const result = await supabaseAdmin.from("modeles").select("*").order("nom");

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    return response.json(result.data ?? []);
  } catch (error) {
    return next(error);
  }
});

adminRouter.get("/admin/modeles/:id", async (request, response, next) => {
  try {
    const modelId = parseIdParam(request.params.id);
    const result = await supabaseAdmin.from("modeles").select("*").eq("id", modelId).maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Modèle introuvable." });
    }

    return response.json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.post("/admin/modeles", async (request, response, next) => {
  try {
    const payload = modelSchema.parse(request.body);
    const result = await supabaseAdmin.from("modeles").insert(payload).select("*").maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(500).json({ message: "Modèle créé mais introuvable dans la réponse." });
    }

    return response.status(201).json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.patch("/admin/modeles/:id", async (request, response, next) => {
  try {
    const modelId = parseIdParam(request.params.id);
    const payload = modelSchema.parse(request.body);
    const result = await supabaseAdmin
      .from("modeles")
      .update(payload)
      .eq("id", modelId)
      .select("*")
      .maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Modèle introuvable." });
    }

    return response.json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.delete("/admin/modeles/:id", async (request, response, next) => {
  try {
    const modelId = parseIdParam(request.params.id);
    const result = await supabaseAdmin.from("modeles").delete().eq("id", modelId).select("id").maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Modèle introuvable." });
    }

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
});

adminRouter.get("/admin/vehicules", async (_request, response, next) => {
  try {
    const result = await supabaseAdmin.from("vehicules").select("*").order("id", { ascending: false });

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    return response.json(result.data ?? []);
  } catch (error) {
    return next(error);
  }
});

adminRouter.get("/admin/vehicules/:id", async (request, response, next) => {
  try {
    const vehicleId = parseIdParam(request.params.id);
    const result = await supabaseAdmin.from("vehicules").select("*").eq("id", vehicleId).maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Véhicule introuvable." });
    }

    return response.json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.post("/admin/vehicules", async (request, response, next) => {
  try {
    const payload = vehicleCreateSchema.parse(request.body);
    const relations = await loadVehicleRelations(payload.model_id);

    if (!hasVehicleRelations(relations)) {
      return response.status(relations.status).json({ message: relations.message });
    }

    const { nextPayload, uploadedPaths } = await resolveVehicleImagePayload(payload);

    const result = await supabaseAdmin
      .from("vehicules")
      .insert({
        nom: nextPayload.nom,
        model_id: relations.model.id,
        marque_id: relations.brand.id,
        marque_nom: relations.brand.nom,
        model_nom: relations.model.nom,
        annee: nextPayload.annee,
        couleur: nextPayload.couleur,
        type_carb: nextPayload.type_carb,
        type_transm: nextPayload.type_transm,
        type_moteur: nextPayload.type_moteur,
        kilometrage: nextPayload.kilometrage ?? null,
        prix_vente: nextPayload.prix_vente ?? null,
        prix_achat: nextPayload.prix_achat ?? null,
        montant_transport: nextPayload.montant_transport ?? null,
        montant_dedouanement: nextPayload.montant_dedouanement ?? null,
        description: nextPayload.description ?? null,
        ind_en_vedette: normalizeFeaturedFlag(nextPayload.ind_en_vedette),
        ind_etat: nextPayload.ind_etat,
        ajoute_par: nextPayload.ajoute_par ?? 1,
        image: nextPayload.image,
        image_2: nextPayload.image_2 ?? null,
        image_3: nextPayload.image_3 ?? null,
        image_4: nextPayload.image_4 ?? null,
        image_5: nextPayload.image_5 ?? null,
        image_6: nextPayload.image_6 ?? null,
        image_7: nextPayload.image_7 ?? null,
        image_8: nextPayload.image_8 ?? null,
        image_9: nextPayload.image_9 ?? null,
        image_10: nextPayload.image_10 ?? null,
      })
      .select("*")
      .maybeSingle();

    if (result.error) {
      try {
        await removeVehicleStorageObjects(uploadedPaths);
      } catch {
        // Ignore storage cleanup failure after a database error.
      }

      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(500).json({ message: "Véhicule créé mais introuvable dans la réponse." });
    }

    return response.status(201).json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.patch("/admin/vehicules/:id", async (request, response, next) => {
  try {
    const vehicleId = parseIdParam(request.params.id);
    const payload = vehicleUpdateSchema.parse(request.body);
    const existingResult = await supabaseAdmin.from("vehicules").select("*").eq("id", vehicleId).maybeSingle();

    if (existingResult.error) {
      return response.status(500).json({ message: existingResult.error.message });
    }

    if (!existingResult.data) {
      return response.status(404).json({ message: "Véhicule introuvable." });
    }

    const nextModelId = payload.model_id ?? existingResult.data.model_id;
    const relations = await loadVehicleRelations(nextModelId);

    if (!hasVehicleRelations(relations)) {
      return response.status(relations.status).json({ message: relations.message });
    }

    const mergedVehicle = {
      ...existingResult.data,
      ...payload,
    };

    const { nextPayload, uploadedPaths, replacedPaths } = await resolveVehicleImagePayload(mergedVehicle, existingResult.data);

    const result = await supabaseAdmin
      .from("vehicules")
      .update({
        nom: nextPayload.nom,
        model_id: relations.model.id,
        marque_id: relations.brand.id,
        marque_nom: relations.brand.nom,
        model_nom: relations.model.nom,
        annee: nextPayload.annee,
        couleur: nextPayload.couleur,
        type_carb: nextPayload.type_carb,
        type_transm: nextPayload.type_transm,
        type_moteur: nextPayload.type_moteur,
        kilometrage: nextPayload.kilometrage ?? null,
        prix_vente: nextPayload.prix_vente ?? null,
        prix_achat: nextPayload.prix_achat ?? null,
        montant_transport: nextPayload.montant_transport ?? null,
        montant_dedouanement: nextPayload.montant_dedouanement ?? null,
        description: nextPayload.description ?? null,
        ind_en_vedette: normalizeFeaturedFlag(nextPayload.ind_en_vedette),
        ind_etat: nextPayload.ind_etat,
        modifie_par: payload.modifie_par ?? existingResult.data.modifie_par ?? existingResult.data.ajoute_par,
        modifie_le: new Date().toISOString(),
        image: nextPayload.image,
        image_2: nextPayload.image_2 ?? null,
        image_3: nextPayload.image_3 ?? null,
        image_4: nextPayload.image_4 ?? null,
        image_5: nextPayload.image_5 ?? null,
        image_6: nextPayload.image_6 ?? null,
        image_7: nextPayload.image_7 ?? null,
        image_8: nextPayload.image_8 ?? null,
        image_9: nextPayload.image_9 ?? null,
        image_10: nextPayload.image_10 ?? null,
      })
      .eq("id", vehicleId)
      .select("*")
      .maybeSingle();

    if (result.error) {
      try {
        await removeVehicleStorageObjects(uploadedPaths);
      } catch {
        // Ignore storage cleanup failure after a database error.
      }

      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Véhicule introuvable." });
    }

    try {
      await removeVehicleStorageObjects(replacedPaths);
    } catch {
      // Ignore cleanup failure once the database update succeeded.
    }

    return response.json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.delete("/admin/vehicules/:id", async (request, response, next) => {
  try {
    const vehicleId = parseIdParam(request.params.id);
    const result = await supabaseAdmin
      .from("vehicules")
      .delete()
      .eq("id", vehicleId)
      .select("id, image, image_2, image_3, image_4, image_5, image_6, image_7, image_8, image_9, image_10")
      .maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Véhicule introuvable." });
    }

    try {
      await removeVehicleStorageObjects(
        vehicleImageFieldKeys
          .map((fieldKey) => getStoragePathFromPublicUrl(result.data?.[fieldKey]))
          .filter((path): path is string => Boolean(path)),
      );
    } catch {
      // Ignore cleanup failure once the database deletion succeeded.
    }

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
});

adminRouter.get("/admin/hero-content", async (_request, response, next) => {
  try {
    const result = await supabaseAdmin.from("hero_content").select("*").eq("id", 1).maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Contenu hero introuvable." });
    }

    return response.json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.post("/admin/hero-content", async (request, response, next) => {
  try {
    const payload = heroContentSchema.parse(request.body);
    const result = await supabaseAdmin
      .from("hero_content")
      .upsert({ id: 1, title: payload.title, image: payload.image })
      .select("*")
      .maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(500).json({ message: "Contenu hero enregistré mais introuvable dans la réponse." });
    }

    return response.status(201).json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.patch("/admin/hero-content", async (request, response, next) => {
  try {
    const payload = heroContentSchema.parse(request.body);
    const result = await supabaseAdmin
      .from("hero_content")
      .update({ title: payload.title, image: payload.image })
      .eq("id", 1)
      .select("*")
      .maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Contenu hero introuvable." });
    }

    return response.json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.delete("/admin/hero-content", async (_request, response, next) => {
  try {
    const result = await supabaseAdmin.from("hero_content").delete().eq("id", 1).select("id").maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Contenu hero introuvable." });
    }

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
});

adminRouter.get("/admin/contact-details", async (_request, response, next) => {
  try {
    const result = await supabaseAdmin.from("contact_details").select("*").eq("id", 1).maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Coordonnées de contact introuvables." });
    }

    return response.json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.post("/admin/contact-details", async (request, response, next) => {
  try {
    const payload = contactDetailsSchema.parse(request.body);
    const result = await supabaseAdmin
      .from("contact_details")
      .upsert({ id: 1, phone: payload.phone, email: payload.email.trim().toLowerCase(), location: payload.location })
      .select("*")
      .maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(500).json({ message: "Coordonnées enregistrées mais introuvables dans la réponse." });
    }

    return response.status(201).json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.patch("/admin/contact-details", async (request, response, next) => {
  try {
    const payload = contactDetailsSchema.parse(request.body);
    const result = await supabaseAdmin
      .from("contact_details")
      .update({ phone: payload.phone, email: payload.email.trim().toLowerCase(), location: payload.location })
      .eq("id", 1)
      .select("*")
      .maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Coordonnées de contact introuvables." });
    }

    return response.json(result.data);
  } catch (error) {
    return next(error);
  }
});

adminRouter.delete("/admin/contact-details", async (_request, response, next) => {
  try {
    const result = await supabaseAdmin.from("contact_details").delete().eq("id", 1).select("id").maybeSingle();

    if (result.error) {
      return response.status(500).json({ message: result.error.message });
    }

    if (!result.data) {
      return response.status(404).json({ message: "Coordonnées de contact introuvables." });
    }

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
});
