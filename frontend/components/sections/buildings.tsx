import Image from "next/image";
import { Check } from "lucide-react";

const buildings = [
  {
    label: "Bâtiment Héritage",
    title: "Le charme de l’existant révélé.",
    copy: "La bâtisse historique conserve ses volumes, sa présence et ses détails d’origine, sublimés par une rénovation contemporaine exigeante.",
    image: "/images/heritage-placeholder.webp",
    features: ["Architecture réhabilitée", "Enduit extérieur à la chaux", "Rénovation de qualité", "Jardins, balcons et terrasses"],
  },
  {
    label: "Bâtiment Horizon",
    title: "Une élégance tournée vers le paysage.",
    copy: "Des lignes épurées et des ouvertures généreuses composent des logements baignés de lumière et connectés à la nature environnante.",
    image: "/images/horizon-placeholder.webp",
    features: ["Confort du thermique", "Chauffage individuel", "Double vitrage performant", "Espaces extérieurs privatifs"],
  },
];

export function Buildings() {
  return (
    <section id="batiments" className="py-24 md:py-32">
      <div className="container-site">
        <p className="eyebrow">Deux écritures, une même adresse</p>
        <h2 className="section-title">Héritage & Horizon</h2>
        <div className="mt-16 space-y-16">
          {buildings.map((building, index) => (
            <article key={building.label} className="grid items-center gap-9 lg:grid-cols-2 lg:gap-16">
              <div className={`relative aspect-[4/3] overflow-hidden rounded-[2rem] ${index % 2 ? "lg:order-2" : ""}`}>
                <Image src={building.image} alt={`Illustration provisoire du ${building.label}`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition duration-700 hover:scale-105" />
                <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[.65rem] font-bold uppercase tracking-[.16em] text-wine backdrop-blur">{building.label}</span>
              </div>
              <div className={index % 2 ? "lg:order-1" : ""}>
                <h3 className="text-4xl font-medium leading-tight md:text-5xl">{building.title}</h3>
                <p className="section-copy mt-6">{building.copy}</p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {building.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <span className="grid size-7 place-items-center rounded-full bg-ivory text-wine"><Check size={14} /></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="mt-9 inline-flex border-b border-wine pb-1 text-sm font-bold text-wine">Demander les plans</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
