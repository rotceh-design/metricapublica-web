"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ExternalLink, Mail, UserRound } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getActiveIntegranteBySlug } from "@/lib/equipo";
import { EquipoIntegrante } from "@/types/equipo";

const imageAspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/9]",
} as const;

const DEFAULT_ROLE_DESCRIPTION =
  "Este perfil forma parte del equipo profesional de Métrica Pública y participa en el desarrollo de análisis, investigación, gestión estratégica o acompañamiento a proyectos según su especialidad.";

type ProfileImageAspect = keyof typeof imageAspectClasses;
type ProfileImageFit = "cover" | "contain";
type ProfileImagePosition = "center" | "top" | "bottom" | "left" | "right";

type EquipoIntegranteWithRoleDescription = EquipoIntegrante & {
  roleDescription?: string;
};

export default function EquipoDetallePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [integrante, setIntegrante] =
    useState<EquipoIntegranteWithRoleDescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIntegrante = async () => {
      try {
        const data = await getActiveIntegranteBySlug(slug);
        setIntegrante(data as EquipoIntegranteWithRoleDescription | null);
      } catch (error) {
        console.error("Error cargando integrante:", error);
        setIntegrante(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadIntegrante();
    }
  }, [slug]);

  const imageAspect = normalizeAspect(integrante?.imageAspect);
  const imageFit = normalizeFit(integrante?.imageFit);
  const imagePosition = normalizePosition(integrante?.imagePosition);

  const bioParagraphs = useMemo(() => {
    return splitParagraphs(integrante?.bio || "");
  }, [integrante?.bio]);

  const roleDescription = useMemo(() => {
    return getRoleDescription(integrante);
  }, [integrante]);

  const roleDescriptionParagraphs = useMemo(() => {
    return splitParagraphs(roleDescription);
  }, [roleDescription]);

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,155,141,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,155,141,0.035)_1px,transparent_1px)] bg-size-[64px_64px]" />
        <div className="pointer-events-none absolute right-[8%] top-40 h-72 w-72 rounded-full bg-[#009B8D]/10 blur-3xl" />
        <div className="pointer-events-none absolute left-[4%] top-80 h-60 w-60 rounded-full bg-[#1a365d]/60 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl">
          {loading ? (
            <LoadingState />
          ) : !integrante ? (
            <NotFoundState />
          ) : (
            <article>
              <Link
                href="/nosotros"
                className="mb-8 inline-flex rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-4 py-2 text-sm font-black text-[#20d6c7] transition hover:border-[#009B8D]/50 hover:bg-[#009B8D]/15 hover:text-white"
              >
                ← Volver a nosotros
              </Link>

              <header className="relative mb-8 overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] via-[#10243d] to-[#08111f] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.25)] md:p-10">
                <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#009B8D]/10 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#1a365d]/50 blur-3xl" />

                <div className="relative z-10 grid gap-8 lg:grid-cols-[320px_1fr] lg:items-center">
                  <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-[2rem] border border-[#009B8D]/20 bg-[#08111f] shadow-[0_24px_80px_rgba(0,0,0,0.28)] lg:mx-0">
                    <div className={imageAspectClasses[imageAspect]}>
                      {integrante.imageUrl ? (
                        <img
                          src={integrante.imageUrl}
                          alt={integrante.name}
                          className="h-full w-full"
                          style={{
                            objectFit: imageFit as CSSProperties["objectFit"],
                            objectPosition:
                              imagePosition as CSSProperties["objectPosition"],
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-[#009B8D]">
                          <UserRound size={56} strokeWidth={1.6} />
                          <span className="text-sm font-black">MP</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="mb-5 flex flex-wrap gap-3">
                      {integrante.featured && (
                        <span className="rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-3 py-1 text-sm font-black text-[#20d6c7]">
                          Integrante destacado
                        </span>
                      )}

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-slate-300">
                        Equipo Métrica Pública
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-slate-300">
                        Perfil profesional
                      </span>
                    </div>

                    <h1 className="wrap-anywhere text-4xl font-black leading-tight text-white md:text-6xl">
                      {integrante.name}
                    </h1>

                    <p className="mt-5 wrap-anywhere text-xl font-black leading-8 text-[#20d6c7] md:text-2xl">
                      {integrante.role || "Integrante del equipo"}
                    </p>

                    <p className="mt-6 max-w-3xl whitespace-pre-wrap wrap-anywhere text-lg leading-8 text-slate-300">
                      {roleDescription}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      {integrante.email && (
                        <a
                          href={`mailto:${integrante.email}`}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-4 text-sm font-black text-white transition hover:bg-[#00877a]"
                        >
                          <Mail size={17} />
                          Enviar correo
                        </a>
                      )}

                      {integrante.linkedin && (
                        <a
                          href={integrante.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 text-sm font-black text-slate-200 transition hover:bg-white/5 hover:text-white"
                        >
                          <ExternalLink size={17} />
                          Ver LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </header>

              <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
                <section className="space-y-8">
                  <div className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                    <div className="border-b border-white/10 bg-[#08111f]/70 px-7 py-5 md:px-10">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#009B8D]">
                        Biografía
                      </p>
                    </div>

                    <div className="space-y-6 p-7 md:p-10">
                      {bioParagraphs.length > 0 ? (
                        bioParagraphs.map((paragraph, index) => (
                          <p
                            key={`${paragraph.slice(0, 24)}-${index}`}
                            className="wrap-anywhere text-lg leading-9 text-slate-300"
                          >
                            {paragraph}
                          </p>
                        ))
                      ) : (
                        <p className="text-lg leading-9 text-slate-400">
                          Este perfil todavía no tiene una biografía publicada.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-10">
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#009B8D]">
                      Rol dentro del equipo
                    </p>

                    <h2 className="mb-4 wrap-anywhere text-3xl font-black text-white">
                      {integrante.role || "Integrante del equipo"}
                    </h2>

                    <div className="space-y-5">
                      {roleDescriptionParagraphs.map((paragraph, index) => (
                        <p
                          key={`${paragraph.slice(0, 24)}-${index}`}
                          className="max-w-3xl whitespace-pre-wrap wrap-anywhere leading-8 text-slate-400"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </section>

                <aside className="h-fit space-y-6 lg:sticky lg:top-28">
                  <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                    <p className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
                      Información
                    </p>

                    <div className="space-y-5 text-sm text-slate-400">
                      <InfoItem label="Nombre" value={integrante.name} wrap />

                      <InfoItem
                        label="Cargo"
                        value={integrante.role || "Sin cargo publicado"}
                        wrap
                      />

                      <InfoItem label="Estado" value="Perfil activo" />

                      <InfoItem
                        label="Tipo"
                        value={integrante.featured ? "Destacado" : "Integrante"}
                      />

                      <InfoItem
                        label="URL"
                        value={`/equipo/${integrante.slug}`}
                        wrap
                      />
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                    <p className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
                      Contacto
                    </p>

                    <div className="space-y-3">
                      {integrante.email ? (
                        <a
                          href={`mailto:${integrante.email}`}
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white transition hover:bg-white/10"
                        >
                          <Mail size={17} className="text-[#20d6c7]" />

                          <span className="wrap-anywhere">
                            {integrante.email}
                          </span>
                        </a>
                      ) : (
                        <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-500">
                          Sin correo publicado
                        </p>
                      )}

                      {integrante.linkedin ? (
                        <a
                          href={integrante.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-2xl border border-[#009B8D]/25 bg-[#009B8D]/10 px-4 py-3 text-sm font-black text-[#20d6c7] transition hover:bg-[#009B8D]/15 hover:text-white"
                        >
                          <ExternalLink size={17} />
                          Ver LinkedIn
                        </a>
                      ) : (
                        <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-500">
                          Sin LinkedIn publicado
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#0f2744] to-[#08111f] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
                      Equipo
                    </p>

                    <h3 className="mb-3 text-2xl font-black text-white">
                      Conoce más perfiles
                    </h3>

                    <p className="mb-5 text-sm leading-6 text-slate-400">
                      Revisa la sección institucional para conocer más sobre
                      Métrica Pública y su equipo.
                    </p>

                    <Link
                      href="/nosotros"
                      className="font-black text-[#20d6c7] transition hover:text-white"
                    >
                      Volver a nosotros →
                    </Link>
                  </div>
                </aside>
              </div>
            </article>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function getRoleDescription(
  integrante: EquipoIntegranteWithRoleDescription | null
): string {
  const customDescription = integrante?.roleDescription?.trim();

  if (customDescription) {
    return customDescription;
  }

  return DEFAULT_ROLE_DESCRIPTION;
}

function normalizeAspect(value?: string): ProfileImageAspect {
  if (value === "square" || value === "portrait" || value === "wide") {
    return value;
  }

  return "square";
}

function normalizeFit(value?: string): ProfileImageFit {
  if (value === "cover" || value === "contain") {
    return value;
  }

  return "cover";
}

function normalizePosition(value?: string): ProfileImagePosition {
  if (
    value === "center" ||
    value === "top" ||
    value === "bottom" ||
    value === "left" ||
    value === "right"
  ) {
    return value;
  }

  return "center";
}

function splitParagraphs(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function InfoItem({
  label,
  value,
  wrap = false,
}: {
  label: string;
  value: string;
  wrap?: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className={`font-bold text-white ${wrap ? "wrap-anywhere" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-[#009B8D]/20" />

      <p className="font-semibold text-slate-400">Cargando perfil...</p>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <span className="mb-4 block text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
        Equipo
      </span>

      <h1 className="mb-4 text-4xl font-black">Integrante no encontrado</h1>

      <p className="mb-6 text-slate-400">
        El perfil no existe o no está activo actualmente.
      </p>

      <Link
        href="/nosotros"
        className="inline-flex rounded-2xl bg-[#009B8D] px-5 py-3 font-black text-white transition hover:bg-[#00877a]"
      >
        Volver a nosotros
      </Link>
    </div>
  );
}