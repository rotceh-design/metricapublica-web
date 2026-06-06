import Link from "next/link";

import { InicioContenido } from "@/types/contenido";
import { Estudio } from "@/types/estudio";

type StudiesProps = {
  contenido: InicioContenido;
  estudios: Estudio[];
  loading: boolean;
};

type StudyCardData = {
  id: string;
  number: string;
  date: string;
  title: string;
  subtitle: string;
  content: string;
  highlights: string[];
  href: string;
  pdfUrl?: string;
  imageUrl?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
};

type MaybeImageData = {
  imageUrl?: string;
  featuredImageUrl?: string;
  coverImageUrl?: string;
  thumbnailUrl?: string;
  image?: string;
  featuredImage?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
};

function getImageUrl(item: unknown) {
  const data = item as MaybeImageData;

  return (
    data.imageUrl ||
    data.featuredImageUrl ||
    data.coverImageUrl ||
    data.thumbnailUrl ||
    data.image ||
    data.featuredImage ||
    ""
  );
}

function getImageFit(item: unknown) {
  const data = item as MaybeImageData;
  return data.imageFit || "cover";
}

function getImagePosition(item: unknown) {
  const data = item as MaybeImageData;
  return data.imagePosition || "center";
}

export default function Studies({
  contenido,
  estudios,
  loading,
}: StudiesProps) {
  const studyCards: StudyCardData[] = estudios.slice(0, 5).map((estudio, index) => {
    const highlights = [
      estudio.category ? `Categoría: ${estudio.category}` : "",
      estudio.year ? `Año de publicación: ${estudio.year}` : "",
      estudio.pdfUrl ? "Documento PDF disponible para descarga." : "",
    ].filter(Boolean);

    return {
      id: estudio.id,
      number: String(index + 1).padStart(2, "0"),
      date: estudio.year || "Publicación",
      title: estudio.title,
      subtitle: estudio.category || "Estudio / Publicación",
      content:
        estudio.summary ||
        estudio.content ||
        "Publicación disponible en el sitio de Métrica Pública.",
      highlights:
        highlights.length > 0
          ? highlights
          : [
              "Información publicada por Métrica Pública.",
              "Contenido disponible para revisión pública.",
              "Material asociado a estudios y publicaciones.",
            ],
      href: `/estudios/${estudio.slug}`,
      pdfUrl: estudio.pdfUrl,
      imageUrl: getImageUrl(estudio),
      imageFit: getImageFit(estudio),
      imagePosition: getImagePosition(estudio),
    };
  });

  const mainStudy = studyCards[0];
  const sideStudies = studyCards.slice(1, 3);
  const bottomStudies = studyCards.slice(3, 5);

  return (
    <section className="relative w-full overflow-hidden bg-[#0f2744] px-4 py-24 text-white sm:px-6 lg:px-10 2xl:px-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,155,141,0.13),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(7,18,33,0.75),transparent_42%)]" />
      <div className="pointer-events-none absolute left-[-10rem] top-24 h-[30rem] w-[30rem] rounded-full bg-[#009B8D]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[#071221]/60 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-[1800px]">
        <div className="mb-10 grid gap-8 xl:grid-cols-[0.78fr_1.22fr] xl:items-end">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-[#009B8D]/25 bg-[#009B8D]/10 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
              {contenido.studiesLabel}
            </span>

            <h2 className="wrap-anywhere max-w-3xl text-3xl font-black leading-tight md:text-5xl">
              {contenido.studiesTitle}
            </h2>
          </div>

          <div className="xl:justify-self-end">
            <p className="max-w-3xl wrap-anywhere text-base leading-8 text-slate-400 md:text-lg xl:text-right">
              {contenido.studiesDescription}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 xl:justify-end">
              <InfoPill label={`${estudios.length} estudios publicados`} />
              <InfoPill label="Evidencia" />
              <InfoPill label="Datos" />
              <InfoPill label="Análisis" />
            </div>
          </div>
        </div>

        {loading ? (
          <StudiesLoading />
        ) : studyCards.length === 0 ? (
          <EmptyStudies />
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              {mainStudy && <MainStudyCard study={mainStudy} />}

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
                {sideStudies.map((study) => (
                  <SideStudyCard key={study.id} study={study} />
                ))}
              </div>
            </div>

            {bottomStudies.length > 0 && (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {bottomStudies.map((study) => (
                  <WideStudyCard key={study.id} study={study} />
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-col gap-4 rounded-[2rem] border border-[#009B8D]/15 bg-[#071221]/70 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
                  Biblioteca pública
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Revisa todos los estudios publicados
                </h3>
              </div>

              <Link
                href="/estudios"
                className="inline-flex items-center justify-center rounded-2xl bg-[#009B8D] px-6 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#00877a]"
              >
                Ver todos los estudios
                <span className="ml-2">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function MainStudyCard({ study }: { study: StudyCardData }) {
  return (
    <article className="group relative flex min-h-[500px] flex-col overflow-hidden rounded-[2.4rem] border border-[#009B8D]/15 bg-[#071221] shadow-[0_30px_100px_rgba(0,0,0,0.34)] transition hover:-translate-y-1 hover:border-[#009B8D]/45">
      <div className="absolute inset-0">
        {study.imageUrl ? (
          <img
            src={study.imageUrl}
            alt={study.title}
            className="h-full w-full transition duration-700 group-hover:scale-105"
            style={{
              objectFit: study.imageFit || "cover",
              objectPosition: study.imagePosition || "center",
            }}
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-[#1a365d] via-[#0f2744] to-[#071221]" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#071221] via-[#071221]/78 to-[#071221]/10" />
      </div>

      <div className="relative z-10 flex items-start justify-between gap-5 p-7 md:p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-3xl text-[#20d6c7] backdrop-blur transition group-hover:bg-[#009B8D] group-hover:text-white">
          ▣
        </div>

        <span className="text-6xl font-black leading-none text-white/10">
          {study.number}
        </span>
      </div>

      <div className="relative z-10 mt-auto p-7 md:p-8">
        <div className="mb-5 flex flex-wrap gap-2">
          <InfoPill label={study.date} />
          <InfoPill label={study.subtitle} />
          {study.pdfUrl && <InfoPill label="PDF disponible" />}
        </div>

        <h3 className="wrap-anywhere text-3xl font-black leading-tight md:text-4xl">
          {study.title}
        </h3>

        <p className="mt-5 max-w-2xl wrap-anywhere text-base leading-8 text-slate-300">
          {study.content}
        </p>

        <div className="mt-7 grid gap-3">
          {study.highlights.slice(0, 3).map((item, index) => (
            <div
              key={item}
              className="flex gap-3 rounded-2xl border border-[#009B8D]/15 bg-[#009B8D]/10 px-4 py-3 text-sm font-semibold text-slate-200 backdrop-blur"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#009B8D] text-xs font-black text-white">
                {index + 1}
              </span>

              <span className="wrap-anywhere">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={study.href}
            className="inline-flex items-center justify-center rounded-2xl bg-[#009B8D] px-6 py-4 text-sm font-black text-white transition hover:bg-[#00877a]"
          >
            Ver estudio
            <span className="ml-2">→</span>
          </Link>

          <Link
            href="/contacto"
            className="inline-flex items-center justify-center rounded-2xl border border-[#009B8D]/35 bg-white/5 px-6 py-4 text-sm font-black text-white transition hover:bg-[#009B8D]/10"
          >
            Solicitar información
          </Link>
        </div>
      </div>
    </article>
  );
}

function SideStudyCard({ study }: { study: StudyCardData }) {
  return (
    <Link
      href={study.href}
      className="group relative flex min-h-[238px] overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#071221] shadow-[0_24px_80px_rgba(0,0,0,0.24)] transition hover:-translate-y-1 hover:border-[#009B8D]/40"
    >
      <div className="absolute inset-0">
        {study.imageUrl ? (
          <img
            src={study.imageUrl}
            alt={study.title}
            className="h-full w-full transition duration-700 group-hover:scale-105"
            style={{
              objectFit: study.imageFit || "cover",
              objectPosition: study.imagePosition || "center",
            }}
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-[#1a365d] to-[#08111f]" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#071221] via-[#071221]/82 to-[#071221]/20" />
      </div>

      <div className="relative z-10 mt-auto p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <InfoPill label={study.date} />
          {study.pdfUrl && <InfoPill label="PDF" />}
        </div>

        <h3 className="wrap-anywhere text-2xl font-black leading-tight">
          {study.title}
        </h3>

        <p className="mt-4 line-clamp-2 wrap-anywhere leading-7 text-slate-400">
          {study.content}
        </p>

        <p className="mt-5 text-sm font-black text-[#20d6c7]">
          Ver estudio →
        </p>
      </div>
    </Link>
  );
}

function WideStudyCard({ study }: { study: StudyCardData }) {
  return (
    <Link
      href={study.href}
      className="group flex min-h-[240px] flex-col rounded-[2rem] border border-[#009B8D]/15 bg-linear-to-br from-[#071221] to-[#0f2744] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:border-[#009B8D]/40"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-2xl text-[#20d6c7] transition group-hover:bg-[#009B8D] group-hover:text-white">
          ▣
        </div>

        <span className="text-4xl font-black text-[#009B8D]/10">
          {study.number}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <InfoPill label={study.date} />
        <InfoPill label={study.subtitle} />
      </div>

      <h3 className="wrap-anywhere text-2xl font-black">{study.title}</h3>

      <p className="mt-4 line-clamp-3 wrap-anywhere leading-7 text-slate-400">
        {study.content}
      </p>

      <div className="mt-auto pt-6">
        <span className="text-sm font-black text-[#20d6c7]">
          Ver estudio →
        </span>
      </div>
    </Link>
  );
}

function EmptyStudies() {
  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#009B8D]/15 bg-[#071221] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-3xl text-[#20d6c7]">
        ▣
      </div>

      <h3 className="mb-3 text-2xl font-black">
        Aún no hay estudios publicados
      </h3>

      <p className="mx-auto max-w-xl leading-7 text-slate-400">
        Los estudios publicados desde el panel administrativo aparecerán
        automáticamente en esta sección.
      </p>
    </div>
  );
}

function StudiesLoading() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="min-h-[500px] rounded-[2.4rem] border border-[#009B8D]/15 bg-[#071221]/80 p-8">
        <div className="mb-10 h-16 w-16 animate-pulse rounded-2xl bg-white/10" />
        <div className="mt-48 h-8 w-2/3 animate-pulse rounded-full bg-white/10" />
        <div className="mt-5 h-4 w-full animate-pulse rounded-full bg-white/10" />
        <div className="mt-3 h-4 w-5/6 animate-pulse rounded-full bg-white/10" />
      </div>

      <div className="grid gap-6">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="min-h-[238px] rounded-[2rem] border border-[#009B8D]/15 bg-[#071221]/80 p-6"
          >
            <div className="mb-4 h-5 w-32 animate-pulse rounded-full bg-white/10" />
            <div className="mb-4 h-8 w-2/3 animate-pulse rounded-full bg-white/10" />
            <div className="mb-3 h-3 w-full animate-pulse rounded-full bg-white/10" />
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoPill({ label }: { label: string }) {
  return (
    <span className="wrap-anywhere rounded-full border border-[#009B8D]/15 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
      {label}
    </span>
  );
}