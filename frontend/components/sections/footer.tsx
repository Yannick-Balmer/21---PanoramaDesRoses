import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-wine-dark py-9 text-white">
      <div className="container-site flex flex-col gap-5 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <Image src="/images/logo-panorama-white.png" alt="Panorama des Roses" width={840} height={310} className="h-16 w-auto self-center md:self-auto" />
        <p className="text-xs text-white/45">© {new Date().getFullYear()} Panorama des Roses · Tous droits réservés</p>
        <a href="#accueil" className="text-xs font-semibold uppercase tracking-widest text-white/65">Retour en haut ↑</a>
      </div>
    </footer>
  );
}
