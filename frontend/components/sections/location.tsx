import { Clock3, MapPin } from "lucide-react";
import Image from "next/image";

export function Location() {
  return (
    <section id="situation" className="py-24 md:py-32">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
          <Image src="/images/location-placeholder.webp" alt="Illustration provisoire du paysage autour de Chilly" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          <div className="absolute bottom-5 left-5 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur">
            <p className="flex items-center gap-2 text-sm font-semibold text-wine"><MapPin size={17} /> Chilly, Haute-Savoie</p>
          </div>
        </div>
        <div>
          <p className="eyebrow">La situation</p>
          <h2 className="section-title">Entre sérénité rurale et vie active.</h2>
          <p className="section-copy mt-7">
            Niché sur les hauteurs de la Haute-Savoie, le village de Chilly offre un panorama dégagé sur la campagne et un ensoleillement généreux.
          </p>
          <div className="mt-8 grid grid-cols-3 divide-x border-y py-6 text-center">
            {["Annecy", "Genève", "Saint-Julien"].map((city) => (
              <div key={city} className="px-2">
                <Clock3 className="mx-auto mb-2 text-wine" size={18} />
                <p className="font-display text-xl">≈ 20 min</p>
                <p className="mt-1 text-[.62rem] uppercase tracking-wider text-muted-foreground">{city}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-lg leading-7 text-muted-foreground">
            Commerces de proximité à Sillingy et Frangy ·{" "}
            <strong className="font-bold">Micro-crèche à 200 mètres.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
