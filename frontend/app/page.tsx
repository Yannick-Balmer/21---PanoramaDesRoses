import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Project } from "@/components/sections/project";
import { Buildings } from "@/components/sections/buildings";
import { Lifestyle } from "@/components/sections/lifestyle";
import { Location } from "@/components/sections/location";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Project />
        <Buildings />
        <Lifestyle />
        <Location />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
