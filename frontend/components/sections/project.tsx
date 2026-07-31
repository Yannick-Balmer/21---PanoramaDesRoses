import { Flower2, Mountain, Sun, Trees } from "lucide-react";

const features = [
  [Trees, "Un site bucolique", "Une ancienne grange réhabilitée au cœur d’un paysage verdoyant."],
  [Sun, "Lumière naturelle", "Des orientations et ouvertures pensées pour un ensoleillement généreux."],
  [Flower2, "Signature végétale", "Des rosiers sélectionnés pour accompagner chaque saison."],
  [Mountain, "Vie pratique", "Annecy, Saint-Julien-en-Genevois et Genève à environ 20 minutes."],
];

export function Project() {
  return (
    <section id="projet" className="soft-gradient py-24 md:py-32">
      <div className="container-site">
        <p className="eyebrow">Le projet</p>
        <div className="mt-4 grid gap-10 lg:grid-cols-[.9fr_1fr] lg:gap-20">
          <h2 className="section-title">La douceur de vivre, naturellement.</h2>
          <div>
            <p className="section-copy text-lg">
              Panorama des Roses préserve soigneusement l’âme et l’architecture d’origine des lieux tout en leur insufflant une modernité chaleureuse.
            </p>
            <p className="section-copy mt-5">
              L’alliance des matériaux nobles et des lignes épurées révèle des espaces lumineux, pensés pour cadrer les paysages et offrir tout le confort du neuf.
            </p>
          </div>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-border sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([Icon, title, copy]) => {
            const FeatureIcon = Icon;
            return (
              <article key={String(title)} className="bg-white p-7">
                <FeatureIcon className="text-wine" size={28} strokeWidth={1.5} />
                <h3 className="mt-8 text-2xl font-semibold">{String(title)}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{String(copy)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
