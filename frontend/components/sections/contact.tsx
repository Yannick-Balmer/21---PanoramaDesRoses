"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeInquirySource } from "@/lib/inquiry-source";

type State = "idle" | "loading" | "success" | "error";

export function Contact() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const sourceInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urlSource = normalizeInquirySource(
      new URLSearchParams(window.location.search).get("source"),
    );
    const storedSource = normalizeInquirySource(
      window.sessionStorage.getItem("inquiry_source"),
    );
    const attributedSource =
      urlSource !== "direct" ? urlSource : storedSource;

    window.sessionStorage.setItem("inquiry_source", attributedSource);
    if (sourceInput.current) {
      sourceInput.current.value = attributedSource;
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const api = process.env.NEXT_PUBLIC_BACK_END ?? "http://localhost:3000";
      const csrfResponse = await fetch(`${api}/csrf/token`, { credentials: "include" });
      if (!csrfResponse.ok) throw new Error("Impossible d’initialiser le formulaire.");
      const { csrfToken } = await csrfResponse.json();
      const response = await fetch(`${api}/inquiries`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message?.[0] ?? data.message ?? "Une erreur est survenue.");
      setState("success");
      setMessage("Votre demande a bien été envoyée. La brochure arrive dans votre boîte mail.");
      event.currentTarget.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Impossible d’envoyer la demande.");
    }
  }

  return (
    <section id="contact" className="soft-gradient py-24 md:py-32">
      <div className="container-site grid gap-12 lg:grid-cols-[.8fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow">Contact</p>
          <h2 className="section-title">Recevez votre brochure privée.</h2>
          <p className="section-copy mt-7 max-w-lg">
            Découvrez les plans, les prestations et les disponibilités. Nous vous recontacterons pour vous accompagner dans votre projet.
          </p>
          <address className="mt-10 space-y-2 text-sm not-italic text-muted-foreground">
            <p>Mougny, 1312 route d’Annecy, 74270 Chilly</p>
            <p>04 50 52 27 65</p>
          </address>
        </div>
        <form onSubmit={submit} className="rounded-[2rem] border bg-white p-6 shadow-[0_24px_70px_rgb(66_16_31/10%)] md:p-9">
          <input ref={sourceInput} type="hidden" name="source" defaultValue="direct" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nom et prénom" name="name" required />
            <Field label="Téléphone" name="phone" type="tel" />
            <div className="sm:col-span-2"><Field label="Adresse e-mail" name="email" type="email" required /></div>
            <div className="sm:col-span-2">
              <Label htmlFor="interest">Je suis intéressé(e) par</Label>
              <select id="interest" name="interest" className="mt-2 h-12 w-full rounded-xl border bg-white px-3 text-sm">
                <option value="Les deux bâtiments">Les deux bâtiments</option>
                <option value="Bâtiment Héritage">Le bâtiment Héritage</option>
                <option value="Bâtiment Horizon">Le bâtiment Horizon</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="message">Votre message</Label>
              <textarea id="message" name="message" rows={4} className="mt-2 w-full resize-none rounded-xl border bg-white p-3 text-sm" placeholder="Parlez-nous de votre projet…" />
            </div>
            <div className="hidden" aria-hidden="true">
              <Label htmlFor="website">Site web</Label><Input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
          </div>
          <label className="mt-5 flex items-start gap-3 text-xs leading-5 text-muted-foreground">
            <input type="checkbox" name="consent" value="true" required className="mt-1 accent-[#e588a5]" />
            J’accepte que mes informations soient utilisées pour répondre à ma demande. Elles ne seront pas transmises à des tiers.
          </label>
          <Button type="submit" disabled={state === "loading"} className="mt-6 h-13 w-full rounded-full bg-rose text-white hover:bg-wine">
            {state === "loading" ? <Loader2 className="animate-spin" /> : <>Recevoir la brochure <ArrowRight /></>}
          </Button>
          {message && (
            <p role="status" className={`mt-5 flex items-start gap-2 text-sm ${state === "success" ? "text-sage-dark" : "text-red-700"}`}>
              {state === "success" && <CheckCircle2 className="mt-.5 shrink-0" size={18} />}{message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return <div><Label htmlFor={name}>{label}{required ? " *" : ""}</Label><Input id={name} name={name} type={type} required={required} className="mt-2 h-12 rounded-xl" /></div>;
}
