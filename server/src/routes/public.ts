import { Router } from "express";
import { supabaseAnon } from "../lib/supabase.js";

export const publicRouter = Router();

publicRouter.get("/public/bootstrap", async (_request, response, next) => {
  try {
    const [heroResult, contactResult, brandsResult, modelsResult, vehiclesResult] = await Promise.all([
      supabaseAnon.from("hero_content").select("*").limit(1).maybeSingle(),
      supabaseAnon.from("contact_details").select("*").limit(1).maybeSingle(),
      supabaseAnon.from("marques").select("*").order("nom"),
      supabaseAnon.from("modeles").select("*").order("nom"),
      supabaseAnon.from("vehicules").select("*").order("id", { ascending: false }),
    ]);

    const errors = [heroResult.error, contactResult.error, brandsResult.error, modelsResult.error, vehiclesResult.error].filter(Boolean);

    if (errors.length > 0) {
      return response.status(500).json({ message: "Erreur de lecture Supabase.", details: errors.map((error) => error?.message) });
    }

    return response.json({
      hero: heroResult.data,
      contact: contactResult.data,
      marques: brandsResult.data ?? [],
      modeles: modelsResult.data ?? [],
      vehicules: vehiclesResult.data ?? [],
    });
  } catch (error) {
    return next(error);
  }
});
