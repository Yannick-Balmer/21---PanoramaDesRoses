"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

const links = [
  ["Le projet", "#projet"],
  ["Les bâtiments", "#batiments"],
  ["Art de vivre", "#art-de-vivre"],
  ["Situation", "#situation"],
  ["Contact", "#contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rose/30 bg-ivory/30 text-wine shadow-[0_8px_30px_rgb(100_28_49/6%)] backdrop-blur-xl">
      <div className="container-site flex h-20 items-center justify-between">
        <a href="#accueil" aria-label="Panorama des Roses — accueil" className="shrink-0">
          <Image
            src="/images/logo-panorama-wine.png"
            alt="Panorama des Roses"
            width={840}
            height={310}
            priority
            className="h-14 w-auto"
          />
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-sm font-medium text-wine/70 transition hover:text-wine">
              {label}
            </a>
          ))}
          <a href="#contact" className="rounded-full bg-rose px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-wine">
            Recevoir la brochure
          </a>
        </nav>
       {/*  <button className="rounded-full p-2 lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Ouvrir le menu">
          {open ? <X /> : <Menu />}
        </button> */}
      </div>
      {/* {open && (
        <nav className="fixed inset-0 top-20 flex flex-col items-center justify-center gap-8 bg-ivory text-wine lg:hidden" aria-label="Navigation mobile">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="font-display text-3xl">
              {label}
            </a>
          ))}
        </nav>
      )} */}
    </header>
  );
}
