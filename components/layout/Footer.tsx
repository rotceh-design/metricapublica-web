import Link from "next/link";

import type { ContenidoGlobal } from "@/types/contenidoGlobal";
import { defaultContenidoGlobal } from "@/types/contenidoGlobal";
import type { FooterContenido } from "@/types/footerContenido";
import { defaultFooterContenido } from "@/types/footerContenido";

type FooterProps = {
  footerContenido?: FooterContenido;
  contenidoGlobal?: ContenidoGlobal;
};

export default function Footer({
  footerContenido = defaultFooterContenido,
  contenidoGlobal = defaultContenidoGlobal,
}: FooterProps) {
  const year = new Date().getFullYear();

  const copyrightText = footerContenido.copyright
    ? footerContenido.copyright.replace("{year}", String(year))
    : `© ${year} ${footerContenido.brandName}. Todos los derechos reservados.`;

  const socialLinks = [
    {
      label: "LinkedIn",
      href: contenidoGlobal.linkedin,
    },
    {
      label: "Instagram",
      href: contenidoGlobal.instagram,
    },
    {
      label: "Facebook",
      href: contenidoGlobal.facebook,
    },
    {
      label: "X / Twitter",
      href: contenidoGlobal.twitter,
    },
  ].filter((social) => social.href && social.href.trim().length > 0);

  return (
    <footer className="border-t border-[#009B8D]/10 bg-[#08111f] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.9fr]">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#009B8D] text-lg font-black text-white">
                MP
              </div>

              <div>
                <p className="wrap-anywhere text-xl font-black">
                  {footerContenido.brandName}
                </p>

                <p className="text-sm text-slate-500">
                  Investigación, datos y estrategia pública
                </p>
              </div>
            </div>

            <p className="max-w-md wrap-anywhere leading-7 text-slate-400">
              {footerContenido.description}
            </p>
          </div>

          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-[#009B8D]">
              {footerContenido.navigationTitle}
            </p>

            <nav className="grid gap-3 text-sm text-slate-400">
              <Link href="/" className="transition hover:text-[#20d6c7]">
                {footerContenido.homeLabel}
              </Link>

              <Link
                href="/nosotros"
                className="transition hover:text-[#20d6c7]"
              >
                {footerContenido.nosotrosLabel}
              </Link>

              <Link
                href="/servicios"
                className="transition hover:text-[#20d6c7]"
              >
                {footerContenido.serviciosLabel}
              </Link>

              <Link
                href="/estudios"
                className="transition hover:text-[#20d6c7]"
              >
                {footerContenido.estudiosLabel}
              </Link>

              <Link
                href="/contacto"
                className="transition hover:text-[#20d6c7]"
              >
                {footerContenido.contactoLabel}
              </Link>
            </nav>
          </div>

          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-[#009B8D]">
              {footerContenido.contactTitle}
            </p>

            <div className="grid gap-4 text-sm">
              <div>
                <p className="mb-1 text-slate-500">
                  {footerContenido.contactEmailLabel}
                </p>

                {footerContenido.contactEmail ? (
                  <a
                    href={`mailto:${footerContenido.contactEmail}`}
                    className="wrap-anywhere font-bold text-white transition hover:text-[#20d6c7]"
                  >
                    {footerContenido.contactEmail}
                  </a>
                ) : (
                  <p className="text-slate-500">No configurado</p>
                )}
              </div>

              <div>
                <p className="mb-1 text-slate-500">
                  {footerContenido.websiteLabel}
                </p>

                {footerContenido.websiteUrl ? (
                  <a
                    href={footerContenido.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wrap-anywhere font-bold text-white transition hover:text-[#20d6c7]"
                  >
                    {footerContenido.websiteValue}
                  </a>
                ) : (
                  <p className="wrap-anywhere font-bold text-white">
                    {footerContenido.websiteValue || "No configurado"}
                  </p>
                )}
              </div>

              <div>
                <p className="mb-1 text-slate-500">
                  {footerContenido.coverageLabel}
                </p>

                <p className="wrap-anywhere font-bold text-white">
                  {footerContenido.coverageValue || "No configurado"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-[#009B8D]">
              Redes sociales
            </p>

            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-[#009B8D]/20 bg-[#009B8D]/10 px-4 py-2 text-xs font-black text-[#20d6c7] transition hover:bg-[#009B8D] hover:text-white"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-slate-500">
                Las redes sociales todavía no están configuradas.
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="wrap-anywhere text-sm text-slate-500">
            {copyrightText}
          </p>

          <p className="text-sm text-slate-600">
            Desarrollado para gestión de contenido institucional.
          </p>
        </div>
      </div>
    </footer>
  );
}