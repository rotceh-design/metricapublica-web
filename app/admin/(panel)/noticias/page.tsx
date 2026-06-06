"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  ImageIcon,
  Newspaper,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { deleteNoticia, getNoticias } from "@/lib/noticias";
import { Noticia } from "@/types/noticia";

const thumbAspectClasses: Record<string, string> = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
};

type StatusFilter = "all" | "published" | "draft";

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const loadNoticias = async () => {
    const data = await getNoticias();
    setNoticias(data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await loadNoticias();
      } catch (error) {
        console.error("Error cargando noticias:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Seguro que quieres eliminar esta noticia?");

    if (!confirmDelete) return;

    await deleteNoticia(id);
    await loadNoticias();
  };

  const publishedCount = noticias.filter(
    (noticia) => noticia.status === "published"
  ).length;

  const draftCount = noticias.filter(
    (noticia) => noticia.status === "draft"
  ).length;

  const withImageCount = noticias.filter((noticia) => noticia.imageUrl).length;

  const categories = useMemo(() => {
    const uniqueCategories = noticias
      .map((noticia) => noticia.category?.trim())
      .filter(Boolean) as string[];

    return Array.from(new Set(uniqueCategories)).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [noticias]);

  const filteredNoticias = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return noticias.filter((noticia) => {
      const matchesSearch =
        !normalizedSearch ||
        noticia.title?.toLowerCase().includes(normalizedSearch) ||
        noticia.summary?.toLowerCase().includes(normalizedSearch) ||
        noticia.slug?.toLowerCase().includes(normalizedSearch) ||
        noticia.category?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || noticia.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || noticia.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [noticias, search, statusFilter, categoryFilter]);

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#009B8D]/15">
          <Activity size={28} className="animate-pulse text-[#009B8D]" />
        </div>

        <p className="font-semibold text-slate-400">Cargando noticias...</p>
      </div>
    );
  }

  return (
    <>
      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex gap-3 sm:grid sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total noticias"
            value={noticias.length}
            detail="Publicaciones creadas"
            Icon={Newspaper}
          />

          <MetricCard
            label="Publicadas"
            value={publishedCount}
            detail="Visibles en la web"
            Icon={CheckCircle2}
          />

          <MetricCard
            label="Borradores"
            value={draftCount}
            detail="Pendientes de publicación"
            Icon={Clock3}
          />

          <MetricCard
            label="Con imagen"
            value={withImageCount}
            detail="Noticias con portada"
            Icon={ImageIcon}
          />
        </div>
      </div>

      <section className="mt-5 rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.22)] sm:p-6">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              Centro de publicaciones
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Gestión de noticias
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Revisa, filtra, edita o crea noticias para mantener actualizado el
              sitio público.
            </p>
          </div>

          <Link
            href="/admin/noticias/nueva"
            prefetch
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#00877a] sm:w-fit"
          >
            <Plus size={17} />
            Crear noticia
          </Link>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_180px_220px]">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título, resumen, slug o categoría..."
              className="w-full rounded-2xl border border-[#009B8D]/10 bg-[#08111f] px-11 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]/45"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="rounded-2xl border border-[#009B8D]/10 bg-[#08111f] px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-[#009B8D]/45"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicadas</option>
            <option value="draft">Borradores</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-2xl border border-[#009B8D]/10 bg-[#08111f] px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-[#009B8D]/45"
          >
            <option value="all">Todas las categorías</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <FilterButton
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            Todas
          </FilterButton>

          <FilterButton
            active={statusFilter === "published"}
            onClick={() => setStatusFilter("published")}
          >
            Publicadas
          </FilterButton>

          <FilterButton
            active={statusFilter === "draft"}
            onClick={() => setStatusFilter("draft")}
          >
            Borradores
          </FilterButton>
        </div>
      </section>

      <section className="mt-5">
        {noticias.length === 0 ? (
          <EmptyState />
        ) : filteredNoticias.length === 0 ? (
          <NoResultsState
            onClear={() => {
              setSearch("");
              setStatusFilter("all");
              setCategoryFilter("all");
            }}
          />
        ) : (
          <div className="grid gap-5">
            {filteredNoticias.map((noticia) => (
              <NewsCard
                key={noticia.id}
                noticia={noticia}
                onDelete={() => handleDelete(noticia.id)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function MetricCard({
  label,
  value,
  detail,
  Icon,
}: {
  label: string;
  value: number;
  detail: string;
  Icon: ElementType;
}) {
  return (
    <article className="w-[158px] flex-none rounded-[1.5rem] border border-[#009B8D]/15 bg-[#0f2744] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.22)] sm:w-auto sm:rounded-[1.7rem] sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-[#20d6c7]">
          <Icon size={21} strokeWidth={2} />
        </div>

        <span className="rounded-full bg-[#009B8D]/15 px-2.5 py-1 text-xs font-black text-[#20d6c7]">
          {value}
        </span>
      </div>

      <p className="text-xs font-bold text-slate-400 sm:text-sm">{label}</p>

      <h2 className="mt-1 text-3xl font-black text-white sm:text-4xl">
        {value}
      </h2>

      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400 sm:text-sm">
        {detail}
      </p>
    </article>
  );
}

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-black transition ${
        active
          ? "bg-[#009B8D] text-white shadow-lg shadow-[#009B8D]/20"
          : "border border-[#009B8D]/15 bg-[#08111f] text-slate-300 hover:border-[#009B8D]/40 hover:text-[#20d6c7]"
      }`}
    >
      {children}
    </button>
  );
}

function NewsCard({
  noticia,
  onDelete,
}: {
  noticia: Noticia;
  onDelete: () => void;
}) {
  const imageAspect = noticia.imageAspect || "wide";
  const imageFit = noticia.imageFit || "cover";
  const imagePosition = noticia.imagePosition || "center";
  const aspectClass = thumbAspectClasses[imageAspect] || thumbAspectClasses.wide;

  const imageStyle: CSSProperties = {
    objectFit: imageFit as CSSProperties["objectFit"],
    objectPosition: imagePosition,
  };

  const statusLabel =
    noticia.status === "published" ? "Publicado" : "Borrador";

  return (
    <article className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] shadow-[0_20px_70px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-[#009B8D]/40">
      <div className="grid gap-0 lg:grid-cols-[260px_1fr]">
        <div className="bg-[#08111f] p-4">
          <div
            className={`overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#08111f] ${aspectClass}`}
          >
            {noticia.imageUrl ? (
              <img
                src={noticia.imageUrl}
                alt={noticia.title}
                className="h-full w-full"
                style={imageStyle}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#009B8D]">
                <ImageIcon size={30} />
                <span className="text-sm font-black">Sin imagen</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-black text-[#20d6c7]">
                  {noticia.category || "Sin categoría"}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    noticia.status === "published"
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "bg-amber-500/10 text-amber-300"
                  }`}
                >
                  {statusLabel}
                </span>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-400">
                  {imageAspect} · {imageFit} · {imagePosition}
                </span>
              </div>

              <h2 className="wrap-anywhere text-2xl font-black leading-tight text-white">
                {noticia.title}
              </h2>

              <p className="mt-2 wrap-anywhere text-sm font-semibold text-slate-500">
                /noticias/{noticia.slug}
              </p>

              <p className="mt-4 max-w-4xl wrap-anywhere text-sm leading-7 text-slate-400 sm:text-base">
                {noticia.summary || "Esta noticia todavía no tiene resumen."}
              </p>
            </div>

            <div className="grid shrink-0 gap-2 sm:grid-cols-3 xl:w-[330px] xl:grid-cols-1">
              <Link
                href={`/noticias/${noticia.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#009B8D]/15 bg-[#08111f] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-[#009B8D]/40 hover:bg-[#1a365d] hover:text-[#20d6c7]"
              >
                <Eye size={16} />
                Ver pública
              </Link>

              <Link
                href={`/admin/noticias/editar/${noticia.id}`}
                prefetch
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-4 py-3 text-sm font-black text-white transition hover:bg-[#00877a]"
              >
                <Pencil size={16} />
                Editar
              </Link>

              <button
                type="button"
                onClick={onDelete}
                className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/20"
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-[#20d6c7]">
        <FileText size={30} />
      </div>

      <h2 className="mb-2 text-2xl font-black text-white">
        No hay noticias todavía
      </h2>

      <p className="mx-auto mb-6 max-w-xl text-slate-400">
        Crea la primera noticia para comenzar a alimentar la web pública de
        Métrica Pública.
      </p>

      <Link
        href="/admin/noticias/nueva"
        prefetch
        className="inline-flex rounded-2xl bg-[#009B8D] px-5 py-3 font-black text-white transition hover:bg-[#00877a]"
      >
        Crear noticia
      </Link>
    </div>
  );
}

function NoResultsState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-[#20d6c7]">
        <Search size={30} />
      </div>

      <h2 className="mb-2 text-2xl font-black text-white">
        No encontramos resultados
      </h2>

      <p className="mx-auto mb-6 max-w-xl text-slate-400">
        Ajusta la búsqueda o limpia los filtros para volver a ver todas las
        noticias.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="inline-flex rounded-2xl bg-[#009B8D] px-5 py-3 font-black text-white transition hover:bg-[#00877a]"
      >
        Limpiar filtros
      </button>
    </div>
  );
}