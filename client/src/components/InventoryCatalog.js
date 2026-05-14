"use client";

import { useState } from "react";
import VehicleCard from "./VehicleCard";

function normalizeSearchValue(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function InventoryCatalog({ vehicles, brands, models }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");

  const yearOptions = [...new Set(vehicles.map((vehicle) => vehicle.annee))].sort(
    (left, right) => right - left,
  );

  const availableModels = selectedBrand === "all"
    ? []
    : models.filter((model) => String(model.marque_id) === selectedBrand);
  const normalizedSearchTerm = normalizeSearchValue(searchTerm);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesYear = selectedYear === "all" || String(vehicle.annee) === selectedYear;
    const matchesBrand =
      selectedBrand === "all" || String(vehicle.marque_id) === selectedBrand;
    const matchesModel = selectedModel === "all" || String(vehicle.model_id) === selectedModel;
    const searchableContent = normalizeSearchValue([
      vehicle.nom,
      vehicle.marque_nom,
      vehicle.model_nom,
      vehicle.description,
    ].join(" "));
    const matchesSearch = !normalizedSearchTerm || searchableContent.includes(normalizedSearchTerm);

    return matchesYear && matchesBrand && matchesModel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="panel rounded-[2rem] p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block md:col-span-2 xl:col-span-4">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Recherche</span>
            <input
              type="search"
              className="field"
              value={searchTerm}
              placeholder="Nom du véhicule, marque, modèle ou description"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Année</span>
            <select
              className="field"
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
            >
              <option value="all">Toutes les années</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Marque</span>
            <select
              className="field"
              value={selectedBrand}
              onChange={(event) => {
                setSelectedBrand(event.target.value);
                setSelectedModel("all");
              }}
            >
              <option value="all">Toutes les marques</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.nom}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Modèle</span>
            <select
              className="field"
              value={selectedModel}
              disabled={selectedBrand === "all"}
              onChange={(event) => setSelectedModel(event.target.value)}
            >
              <option value="all">
                {selectedBrand === "all" ? "Choisir d'abord une marque" : "Tous les modèles"}
              </option>
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.nom}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {filteredVehicles.length === 0 ? (
        <div className="panel rounded-[1.75rem] p-8 text-center text-slate-700">
          Aucun véhicule ne correspond à votre recherche ou à ces filtres pour le moment.
        </div>
      ) : null}
    </div>
  );
}