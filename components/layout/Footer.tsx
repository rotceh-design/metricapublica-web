export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#009B8D]/10 bg-[#08111f] px-6 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#009B8D] font-bold text-white">
            MP
          </div>

          <div>
            <p className="font-bold">Métrica Pública</p>
            <p className="text-sm text-slate-400">
              Investigación, datos y estrategia pública
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-5 text-sm text-slate-400">
          <a href="/nosotros" className="transition hover:text-[#009B8D]">
            Quiénes somos
          </a>
          <a href="/servicios" className="transition hover:text-[#009B8D]">
            Servicios
          </a>
          <a href="/estudios" className="transition hover:text-[#009B8D]">
            Estudios
          </a>
          <a href="/noticias" className="transition hover:text-[#009B8D]">
            Noticias
          </a>
          <a href="/contacto" className="transition hover:text-[#009B8D]">
            Contacto
          </a>
        </nav>

        <p className="text-sm text-slate-500">
          © {year} Métrica Pública. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}