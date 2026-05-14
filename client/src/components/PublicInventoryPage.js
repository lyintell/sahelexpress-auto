import InventoryCatalog from "./InventoryCatalog";

export default function PublicInventoryPage({ vehicles, brands, models }) {
  return (
    <div className="pb-20 pt-6 sm:pt-10">
      <section className="section-shell">
        <div className="panel rounded-[2rem] p-8 sm:p-10">
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold sm:text-4xl">
            Trouvez un véhicule selon vos préférences et votre budget.
          </h1>
        </div>
      </section>

      <section className="section-shell mt-8">
        <InventoryCatalog vehicles={vehicles} brands={brands} models={models} />
      </section>
    </div>
  );
}