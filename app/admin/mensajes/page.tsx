"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "@/lib/firebase";
import {
  deleteMensajeContacto,
  getMensajesContacto,
  markMensajeAsRead,
  markMensajeAsUnread,
} from "@/lib/contacto";
import { MensajeContacto } from "@/types/mensaje";

function formatDate(value: unknown) {
  if (!value) return "Sin fecha";

  if (value instanceof Date) {
    return value.toLocaleString("es-CL");
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toLocaleString("es-CL");
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in value &&
    typeof (value as { seconds: number }).seconds === "number"
  ) {
    return new Date(
      (value as { seconds: number }).seconds * 1000
    ).toLocaleString("es-CL");
  }

  return "Sin fecha";
}

export default function AdminMensajesPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMensajes = async () => {
    const data = await getMensajesContacto();
    setMensajes(data);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
        return;
      }

      setUser(currentUser);
      await loadMensajes();
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleToggleRead = async (mensaje: MensajeContacto) => {
    if (mensaje.read) {
      await markMensajeAsUnread(mensaje.id);
    } else {
      await markMensajeAsRead(mensaje.id);
    }

    await loadMensajes();
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Seguro que quieres eliminar este mensaje?");

    if (!confirmDelete) return;

    await deleteMensajeContacto(id);
    await loadMensajes();
  };

  const unreadCount = mensajes.filter((mensaje) => !mensaje.read).length;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <p className="text-slate-400">Cargando mensajes...</p>
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

            <h1 className="text-3xl font-bold">Mensajes de contacto</h1>

            <p className="mt-1 wrap-anywhere text-sm text-slate-400">
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

            <span className="rounded-xl border border-[#009B8D]/20 bg-[#009B8D]/10 px-5 py-3 text-center text-sm font-bold text-[#009B8D]">
              {unreadCount} sin leer
            </span>
          </div>
        </div>
      </header>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {mensajes.length === 0 ? (
            <div className="rounded-2xl border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center">
              <h2 className="mb-2 text-2xl font-bold">
                No hay mensajes todavía
              </h2>

              <p className="text-slate-400">
                Cuando alguien complete el formulario de contacto, aparecerá en
                esta sección.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {mensajes.map((mensaje) => (
                <article
                  key={mensaje.id}
                  className={`rounded-2xl border p-6 ${
                    mensaje.read
                      ? "border-white/10 bg-[#0f2744]"
                      : "border-[#009B8D]/35 bg-[#009B8D]/10"
                  }`}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            mensaje.read
                              ? "border border-white/10 text-slate-400"
                              : "bg-[#009B8D] text-white"
                          }`}
                        >
                          {mensaje.read ? "Leído" : "Nuevo"}
                        </span>

                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                          {formatDate(mensaje.createdAt)}
                        </span>
                      </div>

                      <h2 className="mb-2 wrap-anywhere text-2xl font-bold">
                        {mensaje.subject || "Sin asunto"}
                      </h2>

                      <div className="mb-5 grid gap-2 text-sm text-slate-400 md:grid-cols-3">
                        <p className="wrap-anywhere">
                          <span className="text-slate-500">Nombre: </span>
                          <span className="font-semibold text-white">
                            {mensaje.name}
                          </span>
                        </p>

                        <p className="wrap-anywhere">
                          <span className="text-slate-500">Correo: </span>
                          <a
                            href={`mailto:${mensaje.email}`}
                            className="font-semibold text-[#009B8D] transition hover:text-white"
                          >
                            {mensaje.email}
                          </a>
                        </p>

                        <p className="wrap-anywhere">
                          <span className="text-slate-500">Teléfono: </span>
                          <span className="font-semibold text-white">
                            {mensaje.phone || "No indicado"}
                          </span>
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-[#08111f]/80 p-5">
                        <p className="whitespace-pre-wrap wrap-anywhere leading-7 text-slate-300">
                          {mensaje.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                      <button
                        onClick={() => handleToggleRead(mensaje)}
                        className="rounded-xl border border-[#009B8D]/30 px-5 py-3 text-center font-semibold text-white transition hover:bg-[#009B8D]/10"
                      >
                        {mensaje.read ? "Marcar no leído" : "Marcar leído"}
                      </button>

                      <a
                        href={`mailto:${mensaje.email}?subject=Respuesta: ${mensaje.subject}`}
                        className="rounded-xl bg-[#009B8D] px-5 py-3 text-center font-bold text-white transition hover:bg-[#00877a]"
                      >
                        Responder
                      </a>

                      <button
                        onClick={() => handleDelete(mensaje.id)}
                        className="rounded-xl border border-red-500/30 px-5 py-3 font-semibold text-red-200 transition hover:bg-red-500/10"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}