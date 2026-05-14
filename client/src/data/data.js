function svgToDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createVehicleImage(label, colorA, colorB) {
  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colorA}" />
          <stop offset="100%" stop-color="${colorB}" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" rx="40" fill="url(#g)" />
      <circle cx="120" cy="92" r="80" fill="rgba(255,255,255,0.14)" />
      <circle cx="700" cy="430" r="120" fill="rgba(255,255,255,0.1)" />
      <path d="M210 312h18l35-92c11-27 37-45 66-45h142c24 0 47 11 63 29l57 63h46c30 0 55 25 55 55v22H647c0-35-28-64-63-64s-63 29-63 64H331c0-35-28-64-63-64s-63 29-63 64h-43v-32c0-25 21-48 48-48Z" fill="rgba(19,20,38,0.75)"/>
      <path d="M352 198h111c14 0 27 6 36 17l42 49H314l31-48c9-12 22-18 38-18Z" fill="rgba(255,255,255,0.88)"/>
      <circle cx="268" cy="344" r="43" fill="#0f172a" />
      <circle cx="584" cy="344" r="43" fill="#0f172a" />
      <circle cx="268" cy="344" r="19" fill="#dbe4ff" />
      <circle cx="584" cy="344" r="19" fill="#dbe4ff" />
      <text x="48" y="442" fill="white" font-family="Arial, sans-serif" font-size="42" font-weight="700">${label}</text>
    </svg>
  `);
}

function createVehicleGallery(label, palettes) {
  return palettes.slice(0, 10).map(([colorA, colorB]) => createVehicleImage(label, colorA, colorB));
}

export const users = [
  { id: 1, nom: "Awa Traore", tel: "+223 70 00 11 22", type_utilisateur: "Admin" },
  { id: 2, nom: "Moussa Diallo", tel: "+223 74 10 22 33", type_utilisateur: "Editeur" },
];

export const brands = [
  { id: 1, nom: "Toyota" },
  { id: 2, nom: "Honda" },
  { id: 3, nom: "Ford" },
  { id: 4, nom: "Hyundai" },
  { id: 5, nom: "Nissan" },
];

export const models = [
  { id: 1, nom: "RAV4", trim: "XLE", marque_id: 1 },
  { id: 2, nom: "Highlander", trim: "Limited", marque_id: 1 },
  { id: 3, nom: "CR-V", trim: "Sport", marque_id: 2 },
  { id: 4, nom: "Escape", trim: "Titanium", marque_id: 3 },
  { id: 5, nom: "Elantra", trim: "Preferred", marque_id: 4 },
  { id: 6, nom: "Rogue", trim: "SV", marque_id: 5 },
  { id: 7, nom: "F-150", trim: "XLT", marque_id: 3 },
  { id: 8, nom: "Civic", trim: "EX", marque_id: 2 },
];

export const vehicles = [
  {
    id: 1,
    nom: "Toyota RAV4 XLE",
    model_id: 1,
    marque_id: 1,
    marque_nom: "Toyota",
    model_nom: "RAV4",
    model_trim: "XLE",
    annee: 2021,
    couleur: "Bleu nuit",
    type_carb: "essence",
    type_transm: "auto",
    type_moteur: "4 cyl",
    kilometrage: 42000,
    description:
      "SUV très apprécié pour Bamako, avec habitacle propre, bon dégagement au sol et conduite souple pour les trajets quotidiens ou les sorties hors centre-ville.",
    ind_en_vedette: "oui",
    ind_etat: "disponible",
    ajoute_par: 1,
    ajoute_le: "2026-05-03T10:00:00.000Z",
    modifie_le: "2026-05-05T15:00:00.000Z",
    images: createVehicleGallery("RAV4 XLE", [
      ["#1d67ff", "#ff5db1"],
      ["#d62828", "#f4c430"],
      ["#1f2937", "#9ca3af"],
      ["#1e3a8a", "#f59e0b"],
    ]),
  },
  {
    id: 2,
    nom: "Honda CR-V Sport",
    model_id: 3,
    marque_id: 2,
    marque_nom: "Honda",
    model_nom: "CR-V",
    model_trim: "Sport",
    annee: 2022,
    couleur: "Rouge volcan",
    type_carb: "essence",
    type_transm: "auto",
    type_moteur: "4 cyl",
    kilometrage: 31500,
    description:
      "CR-V récent avec espace intérieur généreux, bonne économie de carburant et style moderne pour une clientèle familiale ou professionnelle.",
    ind_en_vedette: "oui",
    ind_etat: "disponible",
    ajoute_par: 2,
    ajoute_le: "2026-05-06T12:30:00.000Z",
    modifie_le: "2026-05-07T09:00:00.000Z",
    images: createVehicleGallery("CR-V SPORT", [
      ["#ff5b6b", "#ffb347"],
      ["#d62828", "#f4c430"],
      ["#334155", "#94a3b8"],
      ["#166534", "#f59e0b"],
    ]),
  },
  {
    id: 3,
    nom: "Ford Escape Titanium",
    model_id: 4,
    marque_id: 3,
    marque_nom: "Ford",
    model_nom: "Escape",
    model_trim: "Titanium",
    annee: 2020,
    couleur: "Gris carbone",
    type_carb: "gasoil",
    type_transm: "auto",
    type_moteur: "6 cyl",
    kilometrage: 58800,
    description:
      "Un SUV confortable avec finition haute, idéal pour les clients qui veulent un bon niveau d'équipement et une présence sobre.",
    ind_en_vedette: "non",
    ind_etat: "non-disponible",
    ajoute_par: 2,
    ajoute_le: "2026-04-29T08:15:00.000Z",
    modifie_le: "2026-05-02T18:45:00.000Z",
    images: createVehicleGallery("ESCAPE", [
      ["#243b53", "#66b3ff"],
      ["#d62828", "#f4c430"],
      ["#0f172a", "#64748b"],
      ["#3f3f46", "#d4d4d8"],
    ]),
  },
  {
    id: 4,
    nom: "Toyota Highlander Limited",
    model_id: 2,
    marque_id: 1,
    marque_nom: "Toyota",
    model_nom: "Highlander",
    model_trim: "Limited",
    annee: 2023,
    couleur: "Blanc perle",
    type_carb: "hybrid",
    type_transm: "auto",
    type_moteur: "hybrid",
    kilometrage: 18000,
    description:
      "Version haute avec silhouette imposante, intérieur premium et motorisation hybride, pensée pour les grandes familles ou les trajets d'affaires.",
    ind_en_vedette: "oui",
    ind_etat: "disponible",
    ajoute_par: 1,
    ajoute_le: "2026-05-08T14:00:00.000Z",
    modifie_le: "2026-05-08T16:00:00.000Z",
    images: createVehicleGallery("HIGHLANDER", [
      ["#5d5fef", "#ff5db1"],
      ["#d62828", "#f4c430"],
      ["#0f172a", "#a855f7"],
      ["#1f2937", "#eab308"],
    ]),
  },
  {
    id: 5,
    nom: "Hyundai Elantra Preferred",
    model_id: 5,
    marque_id: 4,
    marque_nom: "Hyundai",
    model_nom: "Elantra",
    model_trim: "Preferred",
    annee: 2021,
    couleur: "Rose cuivre",
    type_carb: "essence",
    type_transm: "auto",
    type_moteur: "4 cyl",
    kilometrage: 37700,
    description:
      "Berline agile et économique avec présentation soignée, utile pour un usage urbain, professionnel ou familial léger.",
    ind_en_vedette: "non",
    ind_etat: "vendu",
    ajoute_par: 2,
    ajoute_le: "2026-05-01T11:20:00.000Z",
    modifie_le: "2026-05-04T07:45:00.000Z",
    images: createVehicleGallery("ELANTRA", [
      ["#ff5db1", "#ffc857"],
      ["#d62828", "#f4c430"],
      ["#475569", "#e2e8f0"],
      ["#7c2d12", "#fb7185"],
    ]),
  },
  {
    id: 6,
    nom: "Nissan Rogue SV",
    model_id: 6,
    marque_id: 5,
    marque_nom: "Nissan",
    model_nom: "Rogue",
    model_trim: "SV",
    annee: 2022,
    couleur: "Noir intense",
    type_carb: "essence",
    type_transm: "auto",
    type_moteur: "4 cyl",
    kilometrage: 29100,
    description:
      "Un crossover bien équipé avec bon volume de coffre, assise haute et présentation rassurante pour la circulation quotidienne à Bamako.",
    ind_en_vedette: "oui",
    ind_etat: "disponible",
    ajoute_par: 1,
    ajoute_le: "2026-05-07T09:30:00.000Z",
    modifie_le: "2026-05-07T11:15:00.000Z",
    images: createVehicleGallery("ROGUE SV", [
      ["#111827", "#ff5b6b"],
      ["#d62828", "#f4c430"],
      ["#14532d", "#86efac"],
      ["#334155", "#cbd5e1"],
    ]),
  },
  {
    id: 7,
    nom: "Ford F-150 XLT",
    model_id: 7,
    marque_id: 3,
    marque_nom: "Ford",
    model_nom: "F-150",
    model_trim: "XLT",
    annee: 2019,
    couleur: "Bleu acier",
    type_carb: "gasoil",
    type_transm: "manuel",
    type_moteur: "8 cyl",
    kilometrage: 73400,
    description:
      "Pickup solide pour un usage mixte chantier et déplacement, avec présence robuste et capacité utile pour des besoins plus exigeants.",
    ind_en_vedette: "non",
    ind_etat: "disponible",
    ajoute_par: 2,
    ajoute_le: "2026-04-26T13:05:00.000Z",
    modifie_le: "2026-04-30T10:40:00.000Z",
    images: createVehicleGallery("F-150 XLT", [
      ["#1d4ed8", "#111827"],
      ["#d62828", "#f4c430"],
      ["#1e293b", "#94a3b8"],
      ["#78350f", "#f59e0b"],
    ]),
  },
  {
    id: 8,
    nom: "Honda Civic EX",
    model_id: 8,
    marque_id: 2,
    marque_nom: "Honda",
    model_nom: "Civic",
    model_trim: "EX",
    annee: 2020,
    couleur: "Blanc glacier",
    type_carb: "essence",
    type_transm: "auto",
    type_moteur: "4 cyl",
    kilometrage: 46200,
    description:
      "Berline connue pour sa régularité, sa sobriété et sa conduite simple, adaptée à un premier achat ou à une utilisation de tous les jours.",
    ind_en_vedette: "non",
    ind_etat: "disponible",
    ajoute_par: 1,
    ajoute_le: "2026-05-05T08:00:00.000Z",
    modifie_le: "2026-05-06T10:10:00.000Z",
    images: createVehicleGallery("CIVIC EX", [
      ["#66b3ff", "#ff5db1"],
      ["#d62828", "#f4c430"],
      ["#0f172a", "#e2e8f0"],
      ["#7c3aed", "#f9a8d4"],
    ]),
  },
];

export const vehiclesWithImages = vehicles.map((vehicle) => ({
  ...vehicle,
  image: vehicle.images[0],
}));

export const contactDetails = {
  phone: "+223 70 00 45 67",
  email: "contact@sahelexpressauto.com",
  location: "Bamako, Mali",
};

export function getFeaturedVehicles(allVehicles, limit = 5) {
  const sortedVehicles = [...allVehicles].sort(
    (left, right) => new Date(right.ajoute_le) - new Date(left.ajoute_le),
  );

  const featuredVehicles = sortedVehicles.filter(
    (vehicle) => vehicle.ind_en_vedette === "oui",
  );

  if (featuredVehicles.length >= limit) {
    return featuredVehicles.slice(0, limit);
  }

  const featuredIds = new Set(featuredVehicles.map((vehicle) => vehicle.id));
  const remainingVehicles = sortedVehicles.filter((vehicle) => !featuredIds.has(vehicle.id));

  return [...featuredVehicles, ...remainingVehicles].slice(0, limit);
}

export function getVehicleById(id) {
  return vehiclesWithImages.find((vehicle) => String(vehicle.id) === String(id));
}