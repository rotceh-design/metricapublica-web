"use client";

import {
  useEffect,
  useMemo,
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
  AtSign,
  Camera,
  CheckCircle2,
  ExternalLink,
  Globe2,
  Save,
  Settings,
  Users,
} from "lucide-react";

import {
  getContenidoGlobal,
  updateContenidoGlobal,
} from "@/lib/contenidoGlobal";
import {
  ContenidoGlobal,
  defaultContenidoGlobal,
} from "@/types/contenidoGlobal";
import { auth } from "@/lib/firebase";

export default function AdminContenidoGlobalPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<ContenidoGlobal>(defaultContenidoGlobal);

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
        const data = await getContenidoGlobal();
        setForm(data);
      } catch (error) {
        console.error("Error cargando ajustes globales:", error);
        setError("No se pudieron cargar los ajustes globales.");
      } finally {
        setChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const socialCount = useMemo(() => {
    return [
      form.linkedin,
      form.instagram,
      form.facebook,
      form.twitter,
    ].filter((value) => value.trim().length > 0).length;
  }, [form]);

  const updateField = <T extends keyof ContenidoGlobal>(
    field: T,
    value: ContenidoGlobal[T]
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
      await updateContenidoGlobal(form);
      setStatusMessage("Ajustes globales guardados correctamente.");
    } catch (error) {
      console.error("Error guardando ajustes globales:", error);
      setError("No se pudieron guardar los ajustes. Revisa Firestore.");
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
            Cargando ajustes globales...
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
              Contenido / Ajustes globales
            </p>

            <h1 className="text-3xl font-black md:text-4xl">
              Redes sociales y estado del sitio
            </h1>

            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              Edita enlaces sociales oficiales y controla si el sitio está
              activo o en modo mantenimiento.
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
              className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white/5"
            >
              Volver a contenido
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-6 py-3 text-sm font-black text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </section>

      <div className="mb-6 flex flex-wrap gap-2">
        <InfoPill label={`${socialCount}/4 redes configuradas`} />
        <InfoPill label={form.siteActive ? "Sitio activo" : "Sitio inactivo"} />
        <InfoPill
          label={
            form.maintenanceMode
              ? "Mantenimiento activado"
              : "Mantenimiento desactivado"
          }
        />
      </div>

      <div className="grid gap-8 2xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-8">
          <PanelCard
            title="Redes sociales"
            description="Enlaces globales que luego podremos mostrar en Footer, Contacto o Navbar."
            Icon={Globe2}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput
                label="LinkedIn"
                value={form.linkedin}
                placeholder="https://linkedin.com/company/..."
                Icon={ExternalLink}
                onChange={(value) => updateField("linkedin", value)}
              />

              <TextInput
                label="Instagram"
                value={form.instagram}
                placeholder="https://instagram.com/..."
                Icon={Camera}
                onChange={(value) => updateField("instagram", value)}
              />

              <TextInput
                label="Facebook"
                value={form.facebook}
                placeholder="https://facebook.com/..."
                Icon={Users}
                onChange={(value) => updateField("facebook", value)}
              />

              <TextInput
                label="X / Twitter"
                value={form.twitter}
                placeholder="https://x.com/..."
                Icon={AtSign}
                onChange={(value) => updateField("twitter", value)}
              />
            </div>
          </PanelCard>

          <PanelCard
            title="Estado del sitio"
            description="Controla el estado general del sitio público."
            Icon={Settings}
          >
            <div className="grid gap-5">
              <ToggleControl
                title="Sitio activo"
                description="Define si el sitio público se considera disponible."
                checked={form.siteActive}
                onChange={(value) => updateField("siteActive", value)}
              />

              <ToggleControl
                title="Modo mantenimiento"
                description="Permite preparar un mensaje de mantenimiento para mostrarlo en el sitio."
                checked={form.maintenanceMode}
                onChange={(value) => updateField("maintenanceMode", value)}
                warning
              />

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  Mensaje de mantenimiento
                </label>

                <textarea
                  value={form.maintenanceMessage}
                  onChange={(event) =>
                    updateField("maintenanceMessage", event.target.value)
                  }
                  rows={5}
                  placeholder="Estamos realizando mejoras en el sitio..."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                />
              </div>
            </div>
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
            title="Resumen"
            description="Vista rápida de los ajustes guardados."
            Icon={Globe2}
          >
            <div className="space-y-5">
              <PreviewStatus
                label="Estado público"
                value={form.siteActive ? "Sitio activo" : "Sitio inactivo"}
                active={form.siteActive}
              />

              <PreviewStatus
                label="Mantenimiento"
                value={form.maintenanceMode ? "Activado" : "Desactivado"}
                active={!form.maintenanceMode}
              />

              <div className="rounded-[1.5rem] border border-white/10 bg-[#08111f]/70 p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Mensaje
                </p>

                <p className="whitespace-pre-wrap wrap-anywhere leading-7 text-slate-300">
                  {form.maintenanceMessage ||
                    "No hay mensaje de mantenimiento definido."}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-[#08111f]/70 p-5">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Redes configuradas
                </p>

                <div className="space-y-3">
                  <SocialPreview label="LinkedIn" value={form.linkedin} />
                  <SocialPreview label="Instagram" value={form.instagram} />
                  <SocialPreview label="Facebook" value={form.facebook} />
                  <SocialPreview label="X / Twitter" value={form.twitter} />
                </div>
              </div>
            </div>
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
          {saving ? "Guardando..." : "Guardar ajustes globales"}
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

function ToggleControl({
  title,
  description,
  checked,
  onChange,
  warning = false,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  warning?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-5 rounded-[1.5rem] border p-5 text-left transition ${
        checked
          ? warning
            ? "border-amber-400/30 bg-amber-400/10"
            : "border-[#009B8D]/35 bg-[#009B8D]/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div>
        <p className="text-lg font-black text-white">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
      </div>

      <span
        className={`relative h-7 w-13 shrink-0 rounded-full transition ${
          checked ? (warning ? "bg-amber-400" : "bg-[#009B8D]") : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}

function PreviewStatus({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#08111f]/70 p-5">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p
        className={`font-black ${
          active ? "text-[#20d6c7]" : "text-amber-300"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SocialPreview({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="wrap-anywhere font-black text-[#20d6c7] transition hover:text-white"
        >
          {value}
        </a>
      ) : (
        <p className="font-semibold text-slate-500">No configurado</p>
      )}
    </div>
  );
}

function InfoPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[#009B8D]/15 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
      {label}
    </span>
  );
}