"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { deleteNoticia, getNoticias } from "@/lib/noticias";
import { Noticia } from "@/types/noticia";

const thumbAspectClasses = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
};

export default function AdminNoticiasPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNoticias = async () => {
    const data = await getNoticias();
    setNoticias(data);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);
      await loadNoticias();
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Seguro que quieres eliminar esta noticia?");

    if (!confirmDelete) return;

    await deleteNoticia(id);
    await loadNoticias();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <p className="text-slate-400">Cargando noticias...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <header className="border-b border-[#009B8D]/10 bg-[#0f2744] px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#009B8D]">
              Panel administrativo
            </p>
            <h1 className="text-3xl font-bold">Noticias</h1>
            <p className="mt-1 text-sm text-slate-400">
              Sesión iniciada como {user?.email}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/admin/dashboard"
              className="rounded-xl border border-white/10 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/5"
            >
              Volver
            </a>

            <a
              href="/admin/noticias/nueva"
              className="rounded-xl bg-[#009B8D] px-5 py-3 text-center font-bold text-white transition hover:bg-[#00877a]"
            >
              Crear noticia
            </a>
          </div>
        </div>
      </header>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {noticias.length === 0 ? (
            <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center">
              <h2 className="mb-2 text-2xl font-bold">No hay noticias todavía</h2>
              <p className="mb-6 text-slate-400">
                Crea la primera noticia para comenzar a alimentar la web.
              </p>
              <a
                href="/admin/noticias/nueva"
                className="inline-flex rounded-xl bg-[#009B8D] px-5 py-3 font-bold text-white transition hover:bg-[#00877a]"
              >
                Crear noticia
              </a>
            </div>
          ) : (
            <div className="grid gap-5">
              {noticias.map((noticia) => {
                const imageAspect = noticia.imageAspect || "wide";
                const imageFit = noticia.imageFit || "cover";
                const imagePosition = noticia.imagePosition || "center";

                return (
                  <article
                    key={noticia.id}
                    className="overflow-hidden rounded-2xl border border-[#009B8D]/15 bg-[#0f2744]"
                  >
                    <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                      <div className="bg-[#08111f] p-4">
                        <div
                          className={`overflow-hidden rounded-2xl border border-white/10 bg-[#08111f] ${thumbAspectClasses[imageAspect]}`}
                        >
                          {noticia.imageUrl ? (
                            <img
                              src={noticia.imageUrl}
                              alt={noticia.title}
                              className="h-full w-full"
                              style={{
                                objectFit: imageFit,
                                objectPosition: imagePosition,
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#009B8D]">
                              MP
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="mb-3 flex flex-wrap gap-2">
                              <span className="rounded-full bg-[#009B8D]/15 px-3 py-1 text-xs font-bold text-[#009B8D]">
                                {noticia.category || "Sin categoría"}
                              </span>

                              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                                {noticia.status === "published"
                                  ? "Publicado"
                                  : "Borrador"}
                              </span>

                              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-500">
                                {imageAspect} · {imageFit} · {imagePosition}
                              </span>
                            </div>

                            <h2 className="mb-2 wrap-anywhere text-2xl font-bold">
                              {noticia.title}
                            </h2>

                            <p className="mb-3 wrap-anywhere text-sm text-slate-500">
                              /noticias/{noticia.slug}
                            </p>

                            <p className="max-w-3xl wrap-anywhere leading-7 text-slate-400">
                              {noticia.summary}
                            </p>
                          </div>

                          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                            <a
                              href={`/admin/noticias/editar/${noticia.id}`}
                              className="rounded-xl border border-[#009B8D]/30 px-5 py-3 text-center font-semibold text-white transition hover:bg-[#009B8D]/10"
                            >
                              Editar
                            </a>

                            <button
                              onClick={() => handleDelete(noticia.id)}
                              className="rounded-xl border border-red-500/30 px-5 py-3 font-semibold text-red-200 transition hover:bg-red-500/10"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}