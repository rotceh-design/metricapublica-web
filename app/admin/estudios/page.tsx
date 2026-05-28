"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { deleteEstudio, getEstudios } from "@/lib/estudios";
import { Estudio } from "@/types/estudio";

const thumbAspectClasses = {
  wide: "aspect-[16/9]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
};

export default function AdminEstudiosPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEstudios = async () => {
    const data = await getEstudios();
    setEstudios(data);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);
      await loadEstudios();
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Seguro que quieres eliminar este estudio?");

    if (!confirmDelete) return;

    await deleteEstudio(id);
    await loadEstudios();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <p className="text-slate-400">Cargando estudios...</p>
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

            <h1 className="text-3xl font-bold">Estudios / Publicaciones</h1>

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
              href="/admin/estudios/nuevo"
              className="rounded-xl bg-[#009B8D] px-5 py-3 text-center font-bold text-white transition hover:bg-[#00877a]"
            >
              Crear estudio
            </a>
          </div>
        </div>
      </header>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {estudios.length === 0 ? (
            <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center">
              <h2 className="mb-2 text-2xl font-bold">
                No hay estudios todavía
              </h2>

              <p className="mb-6 text-slate-400">
                Crea el primer estudio o publicación para mostrarlo en la web.
              </p>

              <a
                href="/admin/estudios/nuevo"
                className="inline-flex rounded-xl bg-[#009B8D] px-5 py-3 font-bold text-white transition hover:bg-[#00877a]"
              >
                Crear estudio
              </a>
            </div>
          ) : (
            <div className="grid gap-5">
              {estudios.map((estudio) => {
                const imageAspect = estudio.imageAspect || "wide";
                const imageFit = estudio.imageFit || "cover";
                const imagePosition = estudio.imagePosition || "center";

                return (
                  <article
                    key={estudio.id}
                    className="overflow-hidden rounded-2xl border border-[#009B8D]/15 bg-[#0f2744]"
                  >
                    <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                      <div className="bg-[#08111f] p-4">
                        <div
                          className={`overflow-hidden rounded-2xl border border-white/10 bg-[#08111f] ${thumbAspectClasses[imageAspect as keyof typeof thumbAspectClasses]}`}
                        >
                          {estudio.imageUrl ? (
                            <img
                              src={estudio.imageUrl}
                              alt={estudio.title}
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
                                {estudio.category || "Sin categoría"}
                              </span>

                              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                                {estudio.status === "published"
                                  ? "Publicado"
                                  : "Borrador"}
                              </span>

                              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-500">
                                {estudio.year || "Sin año"}
                              </span>

                              {estudio.pdfUrl && (
                                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-500">
                                  PDF disponible
                                </span>
                              )}
                            </div>

                            <h2 className="mb-2 wrap-anywhere text-2xl font-bold">
                              {estudio.title}
                            </h2>

                            <p className="mb-3 wrap-anywhere text-sm text-slate-500">
                              /estudios/{estudio.slug}
                            </p>

                            <p className="max-w-3xl wrap-anywhere leading-7 text-slate-400">
                              {estudio.summary}
                            </p>
                          </div>

                          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                            <a
                              href={`/admin/estudios/editar/${estudio.id}`}
                              className="rounded-xl border border-[#009B8D]/30 px-5 py-3 text-center font-semibold text-white transition hover:bg-[#009B8D]/10"
                            >
                              Editar
                            </a>

                            <button
                              onClick={() => handleDelete(estudio.id)}
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