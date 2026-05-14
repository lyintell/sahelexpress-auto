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
];

const vehicleImageFields = vehicleImageFieldKeys.map((fieldKey, index) => ({
  key: fieldKey,
  label: `Image ${index + 1}`,
  type: "file",
  description: index === 0 ? "Image principale utilisée sur la carte véhicule." : "Image additionnelle du véhicule.",
  required: index === 0,
}));

const primaryVehicleImageField = vehicleImageFields[0];
const secondaryVehicleImageFields = vehicleImageFields.slice(1);

const entityConfig = {
  marques: {
    key: "marques",
    singular: "Marque",
    plural: "Marques",
    basePath: "/mode-editeur/marques",
    fields: [
      { key: "id", label: "ID", type: "number", hiddenOnForm: true },
      { key: "nom", label: "Nom", type: "text", required: true },
    ],
  },
  modeles: {
    key: "modeles",
    singular: "Modèle",
    plural: "Modèles",
    basePath: "/mode-editeur/modeles",
    fields: [
      { key: "id", label: "ID", type: "number", hiddenOnForm: true },
      { key: "nom", label: "Nom", type: "text", required: true },
      {
        key: "marque_id",
        label: "Marque",
        type: "select",
        valueType: "number",
        optionsSource: "marques",
        optionLabelKey: "nom",
        optionValueKey: "id",
        placeholder: "Choisir une marque",
      },
    ],
  },
  vehicules: {
    key: "vehicules",
    singular: "Véhicule",
    plural: "Véhicules",
    basePath: "/mode-editeur/vehicules",
    listFields: [
      { key: "id", label: "ID", type: "number" },
      { key: "nom", label: "Nom", type: "text" },
      { key: "marque_nom", label: "Nom de la marque", type: "text" },
      { key: "model_nom", label: "Nom du modèle", type: "text" },
      { key: "annee", label: "Année", type: "number" },
      { key: "couleur", label: "Couleur", type: "text" },
      {
        key: "ind_etat",
        label: "État",
        type: "select",
        options: [
          { label: "Disponible", value: "disponible" },
          { label: "Non-disponible", value: "non-disponible" },
          { label: "Vendu", value: "vendu" },
        ],
      },
    ],
    fields: [
      { key: "id", label: "ID", type: "number", hiddenOnForm: true },
      {
        key: "model_id",
        label: "Modèle",
        type: "select",
        valueType: "number",
        optionsSource: "modeles",
        relatedSource: "marques",
        optionLabelStrategy: "brand-model",
        optionValueKey: "id",
        placeholder: "Choisir un modèle",
        required: true,
      },
      { key: "nom", label: "Nom", type: "text", required: true },
      { key: "marque_id", label: "ID marque", type: "number", hiddenOnForm: true },
      { key: "marque_nom", label: "Nom de la marque", type: "text", hiddenOnForm: true },
      { key: "model_nom", label: "Nom du modèle", type: "text", hiddenOnForm: true },
      { key: "annee", label: "Année", type: "number", required: true },
      { key: "couleur", label: "Couleur", type: "text", required: true },
      {
        key: "type_moteur",
        label: "Type de moteur",
        type: "select",
        required: true,
        placeholder: "Choisir un moteur",
        options: [
          { label: "8 cyl", value: "8 cyl" },
          { label: "6 cyl", value: "6 cyl" },
          { label: "4 cyl", value: "4 cyl" },
          { label: "Hybrid", value: "hybrid" },
        ],
      },
      {
        key: "type_transm",
        label: "Type de transmission",
        type: "select",
        required: true,
        placeholder: "Choisir une transmission",
        options: [
          { label: "Auto", value: "auto" },
          { label: "Manuel", value: "manuel" },
        ],
      },
      {
        key: "type_carb",
        label: "Type de carburant",
        type: "select",
        required: true,
        placeholder: "Choisir un carburant",
        options: [
          { label: "Essence", value: "essence" },
          { label: "Gasoil", value: "gasoil" },
        ],
      },
      {
        key: "ind_etat",
        label: "Indicateur d'état",
        type: "select",
        options: [
          { label: "Disponible", value: "disponible" },
          { label: "Non-disponible", value: "non-disponible" },
          { label: "Vendu", value: "vendu" },
        ],
        placeholder: "Choisir un état",
        required: true,
      },
      {
        key: "ind_en_vedette",
        label: "Indicateur vedette",
        type: "toggle",
        defaultValue: "oui",
        required: true,
      },
      primaryVehicleImageField,
      { key: "description", label: "Description", type: "textarea" },
      { key: "kilometrage", label: "Kilométrage", type: "number" },
      { key: "ajoute_par", label: "Ajouté par", type: "number", hiddenOnForm: true },
      { key: "ajoute_le", label: "Ajouté le", type: "text", hiddenOnForm: true },
      { key: "modifie_par", label: "Modifié par", type: "number", hiddenOnForm: true },
      { key: "modifie_le", label: "Modifié le", type: "text", hiddenOnForm: true },
      ...secondaryVehicleImageFields,
    ],
  },
};

export const editorNavigation = [
  { href: "/mode-editeur/hero", label: "Hero" },
  { href: "/mode-editeur/contact", label: "Contact" },
  { href: "/mode-editeur/marques", label: "Marques" },
  { href: "/mode-editeur/modeles", label: "Modèles" },
  { href: "/mode-editeur/vehicules", label: "Véhicules" },
  { href: "/mode-editeur/mon-profil", label: "Mon profil" },
  { href: "/mode-editeur/mot-de-passe", label: "Changer mot de passe" },
];

export function getEntityConfig(entityKey) {
  return entityConfig[entityKey] ?? null;
}

export function getEntityInitialValues(entityKey) {
  const config = getEntityConfig(entityKey);

  if (!config) {
    return null;
  }

  return Object.fromEntries(
    config.fields.map((field) => {
      if (field.type === "list") {
        return [field.key, []];
      }

      return [field.key, field.defaultValue ?? ""];
    }),
  );
}

export function formatEntityValue(field, value) {
  if (Array.isArray(value)) {
    return `${value.length} élément${value.length > 1 ? "s" : ""}`;
  }

  if (value === "" || value === null || value === undefined) {
    return "-";
  }

  if (Array.isArray(field.options)) {
    const matchingOption = field.options.find(
      (option) => String(option.value) === String(value),
    );

    if (matchingOption) {
      return matchingOption.label;
    }
  }

  return String(value);
}
