import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section id="accueil" className="relative flex min-h-[94svh] items-end overflow-hidden bg-wine-dark text-white">
      <Image 
        src="/images/hero-placeholder.webp" 
        alt="Vue d’ambiance de la résidence Panorama des Roses" 
        fill priority sizes="100vw" 
        className="object-cover object-[60%_center] opacity-100 md:object-[center_35%]"/>
      
      <div className="container-site relative z-10 grid gap-10 pb-14 pt-36 lg:grid-cols-[1fr_auto] lg:items-end lg:pb-20">
        <div className="reveal max-w-4xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[.28em] text-blush">Nouvelle adresse à Chilly · Haute-Savoie</p>
          <h1 className="font-brand text-[clamp(3.4rem,9vw,7.8rem)] uppercase leading-[.78] tracking-[-.025em]">
            Panorama <span className="block pl-[6vw] text-blush">des Roses</span>
          </h1>
          <p className="mt-10 max-w-xl text-base leading-7 text-white/78 md:text-lg">
            17 logements de 30 à 132 m², entre patrimoine préservé et modernité raffinée, dans un écrin bucolique baigné de lumière.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#contact" className="inline-flex items-center gap-3 rounded-full bg-rose px-6 py-4 text-sm font-semibold text-white transition hover:bg-white hover:text-wine">
              Recevoir la brochure <ArrowRight size={17} />
            </a>
            <a href="#projet" className="inline-flex items-center gap-3 rounded-full border border-white/35 px-6 py-4 text-sm font-semibold transition hover:bg-white/10">
              Découvrir le projet <ArrowDown size={17} />
            </a>
          </div>
        </div>
        <dl className="reveal reveal-delay grid grid-cols-3 divide-x divide-white/25 border-y border-white/25 py-5 text-center lg:w-[390px]">
          {[
            ["17", "logements"],
            ["2", "bâtiments"],
            ["30–132", "m²"],
          ].map(([value, label]) => (
            <div key={label} className="px-3">
              <dt className="font-display text-3xl text-blush">{value}</dt>
              <dd className="mt-1 text-[.58rem] uppercase tracking-[.16em] text-white/60">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
