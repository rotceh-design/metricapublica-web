export default function Contact() {
  return (
    <section
      id="contacto"
      className="relative overflow-hidden bg-[#0f2744] px-6 py-24 text-white"
    >
      <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-[#009B8D]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            Contacto
          </span>

          <h2 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
            Conversemos sobre tu próximo estudio
          </h2>

          <p className="text-lg leading-8 text-slate-400">
            Podemos apoyar diagnósticos, estudios de opinión pública, análisis
            territorial, investigaciones cualitativas y asesoría estratégica.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0a1628]/70 p-8">
            <h3 className="mb-6 text-2xl font-bold">Información de contacto</h3>

            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#009B8D]/15 text-xl">
                  ✉️
                </div>

                <div>
                  <p className="text-sm text-slate-400">Correo</p>
                  <a
                    href="mailto:contacto@metricapublica.cl"
                    className="font-semibold text-white transition hover:text-[#009B8D]"
                  >
                    contacto@metricapublica.cl
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#009B8D]/15 text-xl">
                  🌐
                </div>

                <div>
                  <p className="text-sm text-slate-400">Sitio web</p>
                  <a
                    href="https://metricapublica.cl"
                    className="font-semibold text-white transition hover:text-[#009B8D]"
                  >
                    metricapublica.cl
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#009B8D]/15 text-xl">
                  📍
                </div>

                <div>
                  <p className="text-sm text-slate-400">Cobertura</p>
                  <p className="font-semibold text-white">
                    Estudios a nivel nacional y territorial
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form className="rounded-2xl border border-[#009B8D]/15 bg-[#0a1628]/70 p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Correo
                </label>
                <input
                  type="email"
                  placeholder="tu@email.cl"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Asunto
              </label>
              <input
                type="text"
                placeholder="Ej: Cotización de estudio"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Mensaje
              </label>
              <textarea
                rows={5}
                placeholder="Cuéntanos qué necesitas investigar o analizar..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
              />
            </div>

            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-[#009B8D] px-6 py-4 font-bold text-white transition hover:bg-[#00877a]"
            >
              Enviar mensaje
            </button>

            <p className="mt-4 text-center text-xs text-slate-500">
              Más adelante conectaremos este formulario con Firebase.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}