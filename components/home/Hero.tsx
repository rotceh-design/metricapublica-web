import { InicioContenido } from "@/types/contenido";

type HeroProps = {
  contenido: InicioContenido;
};

export default function Hero({ contenido }: HeroProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-[#0a1628] via-[#1a365d] to-[#234e82] px-6 pt-24 text-center">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,155,141,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,155,141,0.04)_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div className="absolute left-[8%] top-[20%] h-24 w-24 rounded-full border border-[#009B8D]/30 opacity-60 blur-[1px]" />
      <div className="absolute bottom-[18%] right-[10%] h-36 w-36 rounded-full bg-[#009B8D]/10 blur-2xl" />
      <div className="absolute right-[18%] top-[26%] h-3 w-3 rounded-full bg-[#009B8D] shadow-[0_0_25px_#009B8D]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <span className="mb-8 inline-flex rounded-full border border-[#009B8D]/30 bg-[#009B8D]/15 px-5 py-2 text-sm font-medium text-[#009B8D]">
          {contenido.heroLabel}
        </span>

        <h1 className="mb-6 wrap-anywhere text-5xl font-bold leading-tight text-white md:text-7xl">
          {contenido.heroTitle}
        </h1>

        <p className="mx-auto mb-10 max-w-2xl wrap-anywhere text-lg leading-8 text-slate-300">
          {contenido.heroDescription}
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href={contenido.primaryButtonHref || "/servicios"}
            className="rounded-lg bg-[#009B8D] px-8 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-[#00877a] hover:shadow-[0_15px_40px_rgba(0,155,141,0.25)]"
          >
            {contenido.primaryButtonLabel}
          </a>

          <a
            href={contenido.secondaryButtonHref || "/estudios"}
            className="rounded-lg border border-[#009B8D]/40 px-8 py-4 font-semibold text-white transition hover:bg-[#009B8D]/10"
          >
            {contenido.secondaryButtonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}