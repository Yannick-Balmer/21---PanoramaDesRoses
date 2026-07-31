import { Car, Home, KeyRound, ShieldCheck } from "lucide-react";

const items = [
  [Home, "17 lots", "Des appartements de 30 à 132 m²."],
  [Car, "Stationnement", "Deux places de parking par logement."],
  [KeyRound, "Prêt à vivre", "Volets roulants."],
  [ShieldCheck, "Confort durable", "Menuiseries performantes et matériaux pérennes."],
];

export function Lifestyle() {
  return (
    <section id="art-de-vivre" className="overflow-hidden bg-wine-dark py-24 text-white md:py-32">
      <div className="container-site relative">
        <div className="absolute -right-24 -top-28 size-72 rounded-full bg-rose/20 blur-3xl" />
        <p className="text-xs font-bold uppercase tracking-[.22em] text-blush">Art de vivre</p>
        <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_.8fr]">
          <h2 className="section-title">Chaque détail compte. Chaque jour aussi.</h2>
          <p className="self-end text-base leading-8 text-white/65">
            Des jardins privatifs aux terrasses en toiture, des matériaux durables aux vues ouvertes : le projet met la qualité d’usage au centre.
          </p>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([Icon, title, copy]) => {
            const ItemIcon = Icon;
            return (
              <article key={String(title)} className="bg-white/[.045] p-7 backdrop-blur">
                <ItemIcon className="text-blush" strokeWidth={1.4} />
                <h3 className="mt-9 text-3xl md:text-4xl">{String(title)}</h3>
                <p className="mt-3 text-lg leading-6 text-white/55">{String(copy)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
