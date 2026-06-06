"use client";

import {
  useEffect,
  useState,
  type ElementType,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Globe2,
  LayoutGrid,
  Mail,
  Save,
  Type,
} from "lucide-react";

import { auth } from "@/lib/firebase";
import {
  getFooterContenido,
  updateFooterContenido,
} from "@/lib/footerContenido";
import {
  FooterContenido,
  defaultFooterContenido,
} from "@/types/footerContenido";

export default function AdminContenidoFooterPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<FooterContenido>(defaultFooterContenido);

  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);

  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);

      try {
        const data = await getFooterContenido();
        setForm(data);
      } catch (error) {
        console.error("Error cargando footer:", error);
        setError("No se pudo cargar el contenido del footer.");
      } finally {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const updateField = <T extends keyof FooterContenido>(
    field: T,
    value: FooterContenido[T]
  ) => {
    setStatusMessage("");
    setError("");

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setStatusMessage("");
    setError("");

    try {
      await updateFooterContenido(form);
      setStatusMessage("Footer guardado correctamente.");
    } catch (error) {
      console.error("Error guardando footer:", error);
      setError("No se pudo guardar el footer. Revisa Firestore.");
    } finally {
      setSaving(false);
    }
  };

  if (checking) {
    return (
      <main className="flex min-h-[360px] items-center justify-center text-white">
        <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#009B8D]/15">
            <Activity size={28} className="animate-pulse text-[#009B8D]" />
          </div>

          <p className="font-semibold text-slate-400">
            Cargando contenido del footer...
          </p>
        </div>
      </main>
    );
  }

  return (
    <form onSubmit={handleSave} className="text-white">
      <section className="mb-6 rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-[#20d6c7]">
              Contenido / Footer
            </p>

            <h1 className="text-3xl font-black md:text-4xl">
              Editar pie de página
            </h1>

            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              Modifica la identidad, enlaces, datos de contacto y texto final
              del footer público.
            </p>

            <p className="mt-2 wrap-anywhere text-xs text-slate-500">
              Sesión activa:{" "}
              <span className="font-semibold text-slate-300">
                {user?.email}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/contenido"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white/5"
            >
              <ArrowLeft size={16} />
              Volver
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-6 py-3 text-sm font-black text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />
              {saving ? "Guardando..." : "Guardar footer"}
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-8 2xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-8">
          <PanelCard
            title="Identidad del footer"
            description="Texto principal que aparece junto al logo del sitio."
            Icon={LayoutGrid}
          >
            <div className="grid gap-5">
              <TextInput
                label="Nombre de marca"
                value={form.brandName}
                placeholder="Métrica Pública"
                Icon={Type}
                onChange={(value) => updateField("brandName", value)}
              />

              <TextareaInput
                label="Descripción"
                value={form.description}
                placeholder="Investigación, análisis de datos y evidencia pública..."
                onChange={(value) => updateField("description", value)}
              />
            </div>
          </PanelCard>

          <PanelCard
            title="Navegación"
            description="Nombres visibles de los enlaces principales del footer."
            Icon={Globe2}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput
                label="Título navegación"
                value={form.navigationTitle}
                placeholder="Navegación"
                Icon={Type}
                onChange={(value) => updateField("navigationTitle", value)}
              />

              <TextInput
                label="Inicio"
                value={form.homeLabel}
                placeholder="Inicio"
                Icon={Type}
                onChange={(value) => updateField("homeLabel", value)}
              />

              <TextInput
                label="Nosotros"
                value={form.nosotrosLabel}
                placeholder="Nosotros"
                Icon={Type}
                onChange={(value) => updateField("nosotrosLabel", value)}
              />

              <TextInput
                label="Servicios"
                value={form.serviciosLabel}
                placeholder="Servicios"
                Icon={Type}
                onChange={(value) => updateField("serviciosLabel", value)}
              />

              <TextInput
                label="Estudios"
                value={form.estudiosLabel}
                placeholder="Estudios"
                Icon={Type}
                onChange={(value) => updateField("estudiosLabel", value)}
              />

              <TextInput
                label="Contacto"
                value={form.contactoLabel}
                placeholder="Contacto"
                Icon={Type}
                onChange={(value) => updateField("contactoLabel", value)}
              />
            </div>
          </PanelCard>

          <PanelCard
            title="Datos de contacto"
            description="Información institucional visible en el footer."
            Icon={Mail}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput
                label="Título contacto"
                value={form.contactTitle}
                placeholder="Contacto"
                Icon={Type}
                onChange={(value) => updateField("contactTitle", value)}
              />

              <TextInput
                label="Etiqueta correo"
                value={form.contactEmailLabel}
                placeholder="Correo"
                Icon={Type}
                onChange={(value) => updateField("contactEmailLabel", value)}
              />

              <TextInput
                label="Correo"
                value={form.contactEmail}
                placeholder="contacto@metricapublica.cl"
                Icon={Mail}
                onChange={(value) => updateField("contactEmail", value)}
              />

              <TextInput
                label="Etiqueta sitio web"
                value={form.websiteLabel}
                placeholder="Sitio web"
                Icon={Type}
                onChange={(value) => updateField("websiteLabel", value)}
              />

              <TextInput
                label="Texto sitio web"
                value={form.websiteValue}
                placeholder="metricapublica.cl"
                Icon={Globe2}
                onChange={(value) => updateField("websiteValue", value)}
              />

              <TextInput
                label="URL sitio web"
                value={form.websiteUrl}
                placeholder="https://metricapublica.cl"
                Icon={ExternalLink}
                onChange={(value) => updateField("websiteUrl", value)}
              />

              <TextInput
                label="Etiqueta cobertura"
                value={form.coverageLabel}
                placeholder="Cobertura"
                Icon={Type}
                onChange={(value) => updateField("coverageLabel", value)}
              />

              <TextInput
                label="Texto cobertura"
                value={form.coverageValue}
                placeholder="Chile y territorios"
                Icon={Globe2}
                onChange={(value) => updateField("coverageValue", value)}
              />
            </div>
          </PanelCard>

          <PanelCard
            title="Texto final"
            description="Texto inferior del footer. Puedes usar {year} para mostrar el año automático."
            Icon={Type}
          >
            <TextareaInput
              label="Copyright"
              value={form.copyright}
              placeholder="© {year} Métrica Pública. Todos los derechos reservados."
              onChange={(value) => updateField("copyright", value)}
            />
          </PanelCard>

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
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </section>

        <aside className="space-y-8 2xl:sticky 2xl:top-8 2xl:h-fit">
          <PanelCard
            title="Vista rápida"
            description="Resumen de cómo quedarán los principales datos."
            Icon={LayoutGrid}
          >
            <div className="rounded-[1.5rem] border border-white/10 bg-[#08111f]/70 p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#009B8D] font-black text-white">
                  MP
                </div>

                <div>
                  <p className="wrap-anywhere text-xl font-black text-white">
                    {form.brandName || "Métrica Pública"}
                  </p>

                  <p className="text-sm text-slate-500">
                    Vista previa del footer
                  </p>
                </div>
              </div>

              <p className="wrap-anywhere leading-7 text-slate-400">
                {form.description || "Sin descripción configurada."}
              </p>
            </div>

            <PreviewItem label="Correo" value={form.contactEmail} />
            <PreviewItem label="Sitio web" value={form.websiteValue} />
            <PreviewItem label="Cobertura" value={form.coverageValue} />
            <PreviewItem label="Copyright" value={form.copyright} />
          </PanelCard>
        </aside>
      </div>

      <div className="sticky bottom-4 z-20 mt-6 rounded-[1.7rem] border border-[#009B8D]/15 bg-[#08111f]/95 p-3 shadow-2xl backdrop-blur 2xl:hidden">
        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-4 text-sm font-black text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {saving ? "Guardando..." : "Guardar footer"}
        </button>
      </div>
    </form>
  );
}

function PanelCard({
  title,
  description,
  Icon,
  children,
}: {
  title: string;
  description: string;
  Icon: ElementType;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="border-b border-white/10 bg-[#08111f]/80 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-[#20d6c7]">
            <Icon size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">{title}</h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function TextInput({
  label,
  value,
  placeholder,
  Icon,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  Icon: ElementType;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-300">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pl-11 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
        />
      </div>
    </div>
  );
}

function TextareaInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-300">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        placeholder={placeholder}
        className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
      />
    </div>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#08111f]/70 p-5">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p className="wrap-anywhere font-black text-white">
        {value || "No configurado"}
      </p>
    </div>
  );
}