"use client";

import { useState } from "react";

import { createMensajeContacto } from "@/lib/contacto";
import { InicioContenido } from "@/types/contenido";
import { MensajeContactoFormData } from "@/types/mensaje";

type ContactProps = {
  contenido: InicioContenido;
};

export default function Contact({ contenido }: ContactProps) {
  const [form, setForm] = useState<MensajeContactoFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  const updateField = (
    field: keyof MensajeContactoFormData,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setStatusMessage("");
    setLoading(true);

    try {
      await createMensajeContacto(form);

      setStatusMessage(
        "Mensaje enviado correctamente. El equipo de Métrica Pública podrá revisarlo desde el panel administrativo."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setError(
        "No se pudo enviar el mensaje. Revisa la conexión o las reglas de Firestore."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contacto"
      className="relative overflow-hidden bg-[#0f2744] px-6 py-24 text-white"
    >
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#009B8D]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
            {contenido.contactLabel}
          </span>

          <h2 className="mb-5 wrap-anywhere text-4xl font-bold leading-tight md:text-5xl">
            {contenido.contactTitle}
          </h2>

          <p className="wrap-anywhere text-lg leading-8 text-slate-400">
            {contenido.contactDescription}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0a1628]/70 p-8">
            <h3 className="mb-6 text-2xl font-bold">
              Información de contacto
            </h3>

            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#009B8D]/15 text-xl">
                  ✉️
                </div>

                <div>
                  <p className="text-sm text-slate-400">Correo</p>

                  <a
                    href="mailto:contacto@metricapublica.cl"
                    className="wrap-anywhere font-semibold text-white transition hover:text-[#009B8D]"
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
                    className="wrap-anywhere font-semibold text-white transition hover:text-[#009B8D]"
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

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#009B8D]/15 bg-[#0a1628]/70 p-8"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Nombre
                </label>

                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Correo
                </label>

                <input
                  type="email"
                  placeholder="tu@email.cl"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                  required
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Teléfono
              </label>

              <input
                type="text"
                placeholder="+56 9 1234 5678"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Asunto
              </label>

              <input
                type="text"
                placeholder="Ej: Cotización de estudio"
                value={form.subject}
                onChange={(event) =>
                  updateField("subject", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                required
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Mensaje
              </label>

              <textarea
                rows={5}
                placeholder="Cuéntanos qué necesitas investigar o analizar..."
                value={form.message}
                onChange={(event) =>
                  updateField("message", event.target.value)
                }
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                required
              />
            </div>

            {statusMessage && (
              <div className="mt-5 rounded-xl border border-[#009B8D]/30 bg-[#009B8D]/10 px-4 py-3 text-sm text-slate-200">
                {statusMessage}
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-[#009B8D] px-6 py-4 font-bold text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Enviando mensaje..." : "Enviar mensaje"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}