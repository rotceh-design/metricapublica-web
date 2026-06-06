"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  Activity,
  ArrowLeft,
  ExternalLink,
  ImageIcon,
  Mail,
  RotateCcw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";

import AdminEditorShell from "@/components/admin/AdminEditorShell";
import { auth } from "@/lib/firebase";
import { createIntegranteEquipo, createTeamSlug } from "@/lib/equipo";
import { uploadFeaturedImage } from "@/lib/storage";
import { EquipoFormData } from "@/types/equipo";

const aspectClasses = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/9]",
} as const;

type TeamImageAspect = keyof typeof aspectClasses;
type TeamImageFit = "cover" | "contain";
type TeamImagePosition = "center" | "top" | "bottom" | "left" | "right";

type TeamEditorForm = EquipoFormData & {
  roleDescription?: string;
};

export default function NuevoIntegranteEquipoPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageProgress, setImageProgress] = useState(0);

  const [form, setForm] = useState<TeamEditorForm>({
    name: "",
    slug: "",
    role: "",
    roleDescription: "",
    bio: "",
    email: "",
    linkedin: "",
    imageUrl: "",
    imageFit: "cover",
    imagePosition: "center",
    imageAspect: "square",
    order: 1,
    active: true,
    featured: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

 const displayImage = imagePreview || form.imageUrl || "";

  const wordCount = useMemo(() => {
    return form.bio.trim().split(/\s+/).filter(Boolean).length;
  }, [form.bio]);

  const roleDescriptionWordCount = useMemo(() => {
    return (form.roleDescription || "").trim().split(/\s+/).filter(Boolean)
      .length;
  }, [form.roleDescription]);

  const completionScore = useMemo(() => {
    const checks = [
      form.name.trim().length > 0,
      form.slug.trim().length > 0,
      form.role.trim().length > 0,
      (form.roleDescription || "").trim().length > 0,
      form.bio.trim().length > 0,
      Number(form.order) > 0,
      Boolean(displayImage),
    ];

    const completed = checks.filter(Boolean).length;

    return Math.round((completed / checks.length) * 100);
  }, [form, displayImage]);

  const imageAspect = normalizeAspect(form.imageAspect);
  const imageFit = normalizeFit(form.imageFit);
  const imagePosition = normalizePosition(form.imagePosition);

  const updateField = <T extends keyof TeamEditorForm>(
    field: T,
    value: TeamEditorForm[T]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "name" && !prev.slug
        ? { slug: createTeamSlug(String(value)) }
        : {}),
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setError("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Debes seleccionar una imagen válida.");
      return;
    }

    const maxSizeInMB = 20;

    if (file.size > maxSizeInMB * 1024 * 1024) {
      setError(
        `La imagen no puede superar los ${maxSizeInMB}MB. Se optimiza automáticamente antes de subir.`
      );
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageProgress(0);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview("");
    setImageProgress(0);

    setForm((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  const resetImageSettings = () => {
    setForm((prev) => ({
      ...prev,
      imageAspect: "square",
      imageFit: "cover",
      imagePosition: "center",
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      let finalImageUrl = form.imageUrl;

      if (imageFile) {
        finalImageUrl = await uploadFeaturedImage(
          imageFile,
          "equipo",
          setImageProgress
        );
      }

      await createIntegranteEquipo({
        ...form,
        slug: form.slug || createTeamSlug(form.name),
        imageUrl: finalImageUrl,
      });

      router.push("/admin/equipo");
    } catch (error) {
      console.error(error);
      setError(
        "No se pudo guardar el integrante. Revisa Firestore, Storage y tu sesión."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#009B8D]/15">
            <Activity size={28} className="animate-pulse text-[#009B8D]" />
          </div>

          <p className="font-semibold text-slate-400">Verificando acceso...</p>
        </div>
      </main>
    );
  }

  return (
    <AdminEditorShell
      title="Agregar integrante"
      description="Crea perfiles del equipo con fotografía, cargo, descripción del rol, biografía, enlaces, estado y orden de visualización."
      userEmail={user?.email}
      backHref="/admin/equipo"
      backLabel="Volver a equipo"
      onLogout={handleLogout}
      actions={
        <button
          type="submit"
          form="new-team-form"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} />
          {saving ? "Guardando..." : "Guardar"}
        </button>
      }
    >
      <form id="new-team-form" onSubmit={handleSubmit}>
        <div className="mb-5 grid gap-3 2xl:grid-cols-[1fr_auto] 2xl:items-center">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/equipo"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-[#009B8D]/40 hover:bg-[#1a365d] hover:text-[#20d6c7]"
            >
              <ArrowLeft size={16} />
              Volver a equipo
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 2xl:justify-end">
            <InfoPill label={`${completionScore}% completo`} />
            <InfoPill label={`Orden ${form.order || 0}`} />
            <InfoPill label={form.active ? "Activo" : "Inactivo"} />
            <InfoPill label={form.featured ? "Destacado" : "Normal"} />
            <InfoPill label={`${wordCount} palabras bio`} />
            <InfoPill label={`${roleDescriptionWordCount} palabras rol`} />
          </div>
        </div>

        <div className="grid w-full gap-5 2xl:grid-cols-[minmax(760px,1.45fr)_minmax(420px,0.65fr)]">
          <section className="space-y-5">
            <EditableTeamProfile
              form={form}
              displayImage={displayImage}
              imageAspect={imageAspect}
              imageFit={imageFit}
              imagePosition={imagePosition}
              onImageChange={handleImageChange}
              onRemoveImage={removeImage}
              onUpdateField={updateField}
            />

            {saving && imageFile && (
              <ProgressPanel
                label="Subiendo fotografía optimizada"
                progress={imageProgress}
              />
            )}

            {error && (
              <div className="rounded-[1.5rem] border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-200">
                {error}
              </div>
            )}
          </section>

          <aside className="space-y-5 2xl:sticky 2xl:top-28 2xl:h-fit">
            <ImageSettingsPanel
              form={form}
              displayImage={displayImage}
              imageAspect={imageAspect}
              imageFit={imageFit}
              imagePosition={imagePosition}
              onUpdateField={updateField}
              onResetImageSettings={resetImageSettings}
              onRemoveImage={removeImage}
            />

            <TeamSummaryPanel
              slug={form.slug}
              order={form.order}
              active={form.active}
              featured={form.featured}
              role={form.role}
              roleDescription={form.roleDescription || ""}
              email={form.email || ""}
              linkedin={form.linkedin || ""}
              completionScore={completionScore}
              hasImage={Boolean(displayImage)}
              wordCount={wordCount}
              roleDescriptionWordCount={roleDescriptionWordCount}
            />
          </aside>
        </div>

        <div className="sticky bottom-4 z-20 mt-5 rounded-[1.7rem] border border-[#009B8D]/15 bg-[#08111f]/95 p-3 shadow-2xl backdrop-blur 2xl:hidden">
          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-4 text-sm font-black text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />
            {saving ? "Guardando..." : "Guardar integrante"}
          </button>
        </div>
      </form>

      <style jsx global>{`
        .field-input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.85rem 1rem;
          color: white;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .field-input::placeholder {
          color: rgb(100 116 139);
        }

        .field-input:focus {
          border-color: rgba(0, 155, 141, 0.8);
          background: rgba(255, 255, 255, 0.07);
        }

        .field-textarea {
          width: 100%;
          resize: none;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          padding: 0.85rem 1rem;
          color: white;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .field-textarea::placeholder {
          color: rgb(100 116 139);
        }

        .field-textarea:focus {
          border-color: rgba(0, 155, 141, 0.8);
          background: rgba(255, 255, 255, 0.07);
        }
      `}</style>
    </AdminEditorShell>
  );
}

function EditableTeamProfile({
  form,
  displayImage,
  imageAspect,
  imageFit,
  imagePosition,
  onImageChange,
  onRemoveImage,
  onUpdateField,
}: {
  form: TeamEditorForm;
  displayImage: string;
  imageAspect: TeamImageAspect;
  imageFit: TeamImageFit;
  imagePosition: TeamImagePosition;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onUpdateField: <T extends keyof TeamEditorForm>(
    field: T,
    value: TeamEditorForm[T]
  ) => void;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="border-b border-white/10 bg-[#08111f] p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#20d6c7]">
            Perfil editable
          </span>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
            Equipo
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_140px_180px]">
          <FieldGroup label="Slug / URL">
            <input
              value={form.slug}
              onChange={(event) =>
                onUpdateField("slug", createTeamSlug(event.target.value))
              }
              placeholder="camila-gonzalez"
              className="field-input"
              required
            />

            <p className="mt-2 wrap-anywhere text-xs text-slate-500">
              URL final: /equipo/{form.slug || "integrante"}
            </p>
          </FieldGroup>

          <FieldGroup label="Orden">
            <input
              type="number"
              min={1}
              value={form.order}
              onChange={(event) =>
                onUpdateField("order", Number(event.target.value))
              }
              className="field-input"
              required
            />
          </FieldGroup>

          <div className="grid gap-3">
            <Toggle
              checked={form.active}
              onChange={(value) => onUpdateField("active", value)}
              title="Activo"
            />

            <Toggle
              checked={form.featured}
              onChange={(value) => onUpdateField("featured", value)}
              title="Destacado"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6">
        <section className="rounded-[1.7rem] border border-white/10 bg-[#08111f] p-5">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start">
            <div className="w-full max-w-[260px] shrink-0 overflow-hidden rounded-[1.6rem] border border-[#009B8D]/20 bg-[#0a1628]">
              <div className={aspectClasses[imageAspect]}>
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={form.name || "Integrante del equipo"}
                    className="h-full w-full"
                    style={{
                      objectFit: imageFit,
                      objectPosition: imagePosition,
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-[#009B8D]">
                    <ImageIcon size={42} />
                    <p className="text-sm font-black">Sin fotografía</p>
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
                Fotografía del perfil
              </p>

              <p className="text-sm leading-6 text-slate-400">
                Sube una foto del integrante. Se optimiza automáticamente antes
                de guardarse. Puedes ajustar formato, encuadre y posición desde
                el panel lateral.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/10 px-4 py-3 text-sm font-black text-[#20d6c7] transition hover:bg-[#009B8D]/15">
                  <UploadCloud size={17} />
                  {displayImage ? "Cambiar fotografía" : "Subir fotografía"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden"
                  />
                </label>

                {displayImage && (
                  <button
                    type="button"
                    onClick={onRemoveImage}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 px-4 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                    Quitar
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 md:grid-cols-2">
          <FieldGroup label="Nombre">
            <input
              value={form.name}
              onChange={(event) => onUpdateField("name", event.target.value)}
              placeholder="Ej: Camila González"
              className="field-input text-xl font-black sm:text-2xl"
              required
            />
          </FieldGroup>

          <FieldGroup label="Cargo">
            <input
              value={form.role}
              onChange={(event) => onUpdateField("role", event.target.value)}
              placeholder="Ej: Directora de estudios"
              className="field-input"
              required
            />
          </FieldGroup>
        </div>

        <FieldGroup label="Descripción del rol dentro del equipo">
          <textarea
            value={form.roleDescription || ""}
            onChange={(event) =>
              onUpdateField("roleDescription", event.target.value)
            }
            placeholder="Ej: Participa en el desarrollo de estudios, análisis, gestión estratégica y acompañamiento a proyectos institucionales."
            rows={5}
            className="field-textarea leading-7"
          />
        </FieldGroup>

        <div className="grid gap-5 md:grid-cols-2">
          <FieldGroup label="Correo">
            <div className="relative">
              <Mail
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="email"
                value={form.email}
                onChange={(event) => onUpdateField("email", event.target.value)}
                placeholder="correo@metricapublica.cl"
                className="field-input pl-11"
              />
            </div>
          </FieldGroup>

          <FieldGroup label="LinkedIn">
            <div className="relative">
              <ExternalLink
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                value={form.linkedin}
                onChange={(event) =>
                  onUpdateField("linkedin", event.target.value)
                }
                placeholder="https://linkedin.com/in/..."
                className="field-input pl-11"
              />
            </div>
          </FieldGroup>
        </div>

        <FieldGroup label="Biografía">
          <textarea
            value={form.bio}
            onChange={(event) => onUpdateField("bio", event.target.value)}
            placeholder="Describe la experiencia, trayectoria o presentación personal/profesional del integrante..."
            rows={13}
            className="field-textarea leading-7"
            required
          />
        </FieldGroup>
      </div>
    </section>
  );
}

function ImageSettingsPanel({
  form,
  displayImage,
  imageAspect,
  imageFit,
  imagePosition,
  onUpdateField,
  onResetImageSettings,
  onRemoveImage,
}: {
  form: TeamEditorForm;
  displayImage: string;
  imageAspect: TeamImageAspect;
  imageFit: TeamImageFit;
  imagePosition: TeamImagePosition;
  onUpdateField: <T extends keyof TeamEditorForm>(
    field: T,
    value: TeamEditorForm[T]
  ) => void;
  onResetImageSettings: () => void;
  onRemoveImage: () => void;
}) {
  return (
    <section className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
          Ajustes de fotografía
        </p>

        <h2 className="mt-1 text-2xl font-black text-white">Imagen</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Controla cómo se verá la fotografía en tarjetas, detalle público y
          administración.
        </p>
      </div>

      <div className="mb-5 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08111f]">
        <div className={aspectClasses[imageAspect]}>
          {displayImage ? (
            <img
              src={displayImage}
              alt={form.name || "Preview del integrante"}
              className="h-full w-full"
              style={{
                objectFit: imageFit,
                objectPosition: imagePosition,
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl font-black text-[#009B8D]">
              MP
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        <ControlSelect
          label="Formato"
          value={imageAspect}
          onChange={(value) =>
            onUpdateField("imageAspect", value as TeamEditorForm["imageAspect"])
          }
          options={[
            { value: "square", label: "Cuadrada" },
            { value: "portrait", label: "Vertical" },
            { value: "wide", label: "Panorámica" },
          ]}
        />

        <ControlSelect
          label="Ajuste"
          value={imageFit}
          onChange={(value) =>
            onUpdateField("imageFit", value as TeamEditorForm["imageFit"])
          }
          options={[
            { value: "cover", label: "Cubrir / recortar" },
            { value: "contain", label: "Mostrar completa" },
          ]}
        />

        <ControlSelect
          label="Posición"
          value={imagePosition}
          onChange={(value) =>
            onUpdateField(
              "imagePosition",
              value as TeamEditorForm["imagePosition"]
            )
          }
          options={[
            { value: "center", label: "Centro" },
            { value: "top", label: "Arriba" },
            { value: "bottom", label: "Abajo" },
            { value: "left", label: "Izquierda" },
            { value: "right", label: "Derecha" },
          ]}
        />

        <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-1">
          <button
            type="button"
            onClick={onResetImageSettings}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#009B8D]/20 bg-[#08111f] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-[#009B8D]/40 hover:text-[#20d6c7]"
          >
            <RotateCcw size={16} />
            Reiniciar
          </button>

          {displayImage && (
            <button
              type="button"
              onClick={onRemoveImage}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/20"
            >
              <Trash2 size={16} />
              Quitar imagen
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function TeamSummaryPanel({
  slug,
  order,
  active,
  featured,
  role,
  roleDescription,
  email,
  linkedin,
  completionScore,
  hasImage,
  wordCount,
  roleDescriptionWordCount,
}: {
  slug: string;
  order: number;
  active: boolean;
  featured: boolean;
  role: string;
  roleDescription: string;
  email: string;
  linkedin: string;
  completionScore: number;
  hasImage: boolean;
  wordCount: number;
  roleDescriptionWordCount: number;
}) {
  return (
    <section className="rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
        Resumen
      </p>

      <div className="mt-4 space-y-4 text-sm">
        <SummaryItem label="Completitud" value={`${completionScore}%`} />
        <SummaryItem label="Estado" value={active ? "Activo" : "Inactivo"} />
        <SummaryItem
          label="Destacado"
          value={featured ? "Destacado" : "Normal"}
        />
        <SummaryItem label="Orden" value={String(order || 0)} />
        <SummaryItem label="Cargo" value={role || "Sin cargo"} wrap />
        <SummaryItem
          label="Descripción del rol"
          value={
            roleDescription
              ? `${roleDescriptionWordCount} palabras`
              : "No definida"
          }
        />
        <SummaryItem
          label="Fotografía"
          value={hasImage ? "Cargada" : "Sin fotografía"}
        />
        <SummaryItem label="Biografía" value={`${wordCount} palabras`} />
        <SummaryItem label="Correo" value={email || "No definido"} wrap />
        <SummaryItem label="LinkedIn" value={linkedin || "No definido"} wrap />
        <SummaryItem
          label="URL"
          value={`/equipo/${slug || "integrante"}`}
          wrap
        />
      </div>
    </section>
  );
}

function ProgressPanel({
  label,
  progress,
}: {
  label: string;
  progress: number;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#009B8D]/15 bg-[#0f2744] p-5">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-400">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#009B8D] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ControlSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-[#10243d] px-3 py-3 text-sm font-bold text-white outline-none transition focus:border-[#009B8D]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-300">
        {label}
      </label>

      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  title,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
        checked
          ? "border-[#009B8D]/35 bg-[#009B8D]/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <span className="text-sm font-black text-white">{title}</span>

      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#009B8D]" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function InfoPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[#009B8D]/15 bg-[#009B8D]/10 px-3 py-1 text-xs font-black text-[#20d6c7]">
      {label}
    </span>
  );
}

function SummaryItem({
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

      <p className={`font-black text-white ${wrap ? "wrap-anywhere" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function normalizeAspect(value?: string): TeamImageAspect {
  if (value === "square" || value === "portrait" || value === "wide") {
    return value;
  }

  return "square";
}

function normalizeFit(value?: string): TeamImageFit {
  if (value === "cover" || value === "contain") {
    return value;
  }

  return "cover";
}

function normalizePosition(value?: string): TeamImagePosition {
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