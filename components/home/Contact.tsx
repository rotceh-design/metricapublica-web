"use client";

import { useState, type ElementType, type FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Globe2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  UserRound,
} from "lucide-react";

import { createMensajeContacto } from "@/lib/contacto";
import {
  ContactoContenido,
  defaultContactoContenido,
} from "@/types/contactoContenido";
import { MensajeContactoFormData } from "@/types/mensaje";

type ContactProps = {
  contactoContenido?: ContactoContenido;
};

export default function Contact({
  contactoContenido = defaultContactoContenido,
}: ContactProps) {
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
    setStatusMessage("");
    setError("");

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setStatusMessage("");
    setLoading(true);

    try {
      await createMensajeContacto(form);

      setStatusMessage(contactoContenido.successMessage);

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

  const emailHref = contactoContenido.emailValue
    ? `mailto:${contactoContenido.emailValue}`
    : undefined;

  const websiteHref = contactoContenido.websiteUrl || undefined;

  return (
    <section
      id="contacto"
      className="relative w-full overflow-hidden bg-[#071221] px-4 py-24 text-white sm:px-6 lg:px-10 2xl:px-14"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,155,141,0.15),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(26,54,93,0.55),transparent_40%),linear-gradient(180deg,#071221_0%,#0f2744_54%,#071221_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,155,141,0.032)_1px,transparent_1px),linear-gradient(90deg,rgba(0,155,141,0.032)_1px,transparent_1px)] bg-size-[56px_56px]" />
      <div className="pointer-events-none absolute -left-48 top-28 h-[30rem] w-[30rem] rounded-full bg-[#009B8D]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-56 bottom-0 h-[34rem] w-[34rem] rounded-full bg-[#1a365d]/45 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-[1800px]">
        <div className="mb-10 grid gap-8 xl:grid-cols-[0.8fr_1.2fr] xl:items-end">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-[#009B8D]/25 bg-[#009B8D]/10 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
              {contactoContenido.label}
            </span>

            <h2 className="wrap-anywhere max-w-4xl text-3xl font-black leading-tight md:text-5xl">
              {contactoContenido.title}
            </h2>
          </div>

          <div className="xl:justify-self-end">
            <p className="max-w-3xl wrap-anywhere text-base leading-8 text-slate-400 md:text-lg xl:text-right">
              {contactoContenido.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 xl:justify-end">
              <InfoPill label="Formulario activo" />
              <InfoPill label="Contacto directo" />
              <InfoPill label="Respuesta registrada" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <aside className="relative flex flex-col overflow-hidden rounded-[2.4rem] border border-[#009B8D]/15 bg-[#08111f] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.36)] md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,155,141,0.22),transparent_36%),linear-gradient(135deg,#0f2744_0%,#08111f_64%,#071221_100%)]" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#009B8D]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-[#1a365d]/70 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-7 flex h-18 w-18 items-center justify-center rounded-[1.6rem] border border-[#009B8D]/20 bg-[#009B8D]/15 text-[#20d6c7]">
                <MessageSquare size={34} strokeWidth={1.6} />
              </div>

              <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
                Canal institucional
              </p>

              <h3 className="wrap-anywhere text-3xl font-black leading-tight md:text-4xl">
                {contactoContenido.infoTitle}
              </h3>

              <p className="mt-6 max-w-2xl wrap-anywhere text-base leading-8 text-slate-300 md:text-lg">
                {contactoContenido.infoDescription}
              </p>
            </div>

            <div className="relative z-10 mt-8 grid gap-4">
              <ContactInfoItem
                Icon={Mail}
                label={contactoContenido.emailLabel}
                value={contactoContenido.emailValue}
                href={emailHref}
              />

              <ContactInfoItem
                Icon={Globe2}
                label={contactoContenido.websiteLabel}
                value={contactoContenido.websiteValue}
                href={websiteHref}
              />

              <ContactInfoItem
                Icon={MapPin}
                label={contactoContenido.coverageLabel}
                value={contactoContenido.coverageValue}
              />
            </div>

            <div className="relative z-10 mt-auto pt-8">
              <div className="rounded-[1.8rem] border border-[#009B8D]/15 bg-[#009B8D]/10 p-5 backdrop-blur">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
                  Seguimiento
                </p>

                <p className="leading-7 text-slate-300">
                  Tu mensaje quedará registrado en el panel administrativo para
                  que el equipo pueda revisarlo y responder de manera ordenada.
                </p>
              </div>
            </div>
          </aside>

          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[2.4rem] border border-[#009B8D]/15 bg-[#0f2744]/88 shadow-[0_30px_100px_rgba(0,0,0,0.34)] backdrop-blur"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-[26rem] w-[26rem] rounded-full bg-[#009B8D]/10 blur-3xl" />

            <div className="relative z-10 border-b border-white/10 bg-[#08111f]/70 p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
                    {contactoContenido.formLabel}
                  </p>

                  <h3 className="mt-2 wrap-anywhere text-3xl font-black md:text-4xl">
                    {contactoContenido.formTitle}
                  </h3>

                  <p className="mt-3 max-w-2xl wrap-anywhere leading-7 text-slate-400">
                    {contactoContenido.formDescription}
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/15 text-[#20d6c7]">
                  <Send size={24} strokeWidth={1.8} />
                </div>
              </div>
            </div>

            <div className="relative z-10 grid gap-5 p-6 md:p-8">
              <div className="grid gap-5 md:grid-cols-2">
                <FormInput
                  label="Nombre"
                  type="text"
                  placeholder={contactoContenido.namePlaceholder}
                  value={form.name}
                  onChange={(value) => updateField("name", value)}
                  required
                  Icon={UserRound}
                />

                <FormInput
                  label="Correo"
                  type="email"
                  placeholder={contactoContenido.emailPlaceholder}
                  value={form.email}
                  onChange={(value) => updateField("email", value)}
                  required
                  Icon={Mail}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FormInput
                  label="Teléfono"
                  type="text"
                  placeholder={contactoContenido.phonePlaceholder}
                  value={form.phone}
                  onChange={(value) => updateField("phone", value)}
                  Icon={Phone}
                />

                <FormInput
                  label="Asunto"
                  type="text"
                  placeholder={contactoContenido.subjectPlaceholder}
                  value={form.subject}
                  onChange={(value) => updateField("subject", value)}
                  required
                  Icon={MessageSquare}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-300">
                  Mensaje
                </label>

                <textarea
                  rows={7}
                  placeholder={contactoContenido.messagePlaceholder}
                  value={form.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  className="w-full resize-none rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D] focus:bg-white/[0.07]"
                  required
                />
              </div>

              {statusMessage && (
                <div className="flex gap-3 rounded-[1.5rem] border border-[#009B8D]/30 bg-[#009B8D]/10 px-5 py-4 text-sm font-bold text-slate-200">
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#20d6c7]"
                  />
                  <span>{statusMessage}</span>
                </div>
              )}

              {error && (
                <div className="flex gap-3 rounded-[1.5rem] border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-bold text-red-200">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-[1.6rem] bg-[#009B8D] px-6 py-5 font-black text-white shadow-[0_24px_80px_rgba(0,155,141,0.24)] transition hover:-translate-y-1 hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} />
                {loading
                  ? contactoContenido.sendingLabel
                  : contactoContenido.submitLabel}
                <span className="transition group-hover:translate-x-1">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactInfoItem({
  Icon,
  label,
  value,
  href,
}: {
  Icon: ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="group flex gap-4 rounded-[1.6rem] border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:border-[#009B8D]/25 hover:bg-white/10">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-[#20d6c7] transition group-hover:bg-[#009B8D] group-hover:text-white">
        <Icon size={22} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-400">{label}</p>

        <p className="wrap-anywhere font-black text-white">
          {value || "No configurado"}
        </p>
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="block"
    >
      {content}
    </a>
  );
}

function FormInput({
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  Icon,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  Icon: ElementType;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-300">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 pl-11 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D] focus:bg-white/[0.07]"
          required={required}
        />
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