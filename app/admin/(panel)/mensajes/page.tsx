"use client";

import { useEffect, useMemo, useState, type ElementType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  ArrowLeft,
  Clock,
  Eye,
  EyeOff,
  Inbox,
  Mail,
  MessageSquare,
  Phone,
  Reply,
  Trash2,
  UserRound,
} from "lucide-react";

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

function getDateTime(value: unknown) {
  if (!value) return 0;

  if (value instanceof Date) {
    return value.getTime();
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().getTime();
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in value &&
    typeof (value as { seconds: number }).seconds === "number"
  ) {
    return (value as { seconds: number }).seconds * 1000;
  }

  return 0;
}

function createMailtoReply(mensaje: MensajeContacto) {
  const subject = encodeURIComponent(
    `Respuesta: ${mensaje.subject || "Consulta Métrica Pública"}`
  );

  const body = encodeURIComponent(
    `Hola ${mensaje.name || ""},\n\nGracias por contactarte con Métrica Pública.\n\n`
  );

  return `mailto:${mensaje.email}?subject=${subject}&body=${body}`;
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

  const sortedMensajes = useMemo(() => {
    return [...mensajes].sort((a, b) => {
      const readA = Boolean(a.read);
      const readB = Boolean(b.read);

      if (readA !== readB) {
        return readA ? 1 : -1;
      }

      return getDateTime(b.createdAt) - getDateTime(a.createdAt);
    });
  }, [mensajes]);

  const unreadCount = mensajes.filter((mensaje) => !mensaje.read).length;
  const readCount = mensajes.filter((mensaje) => mensaje.read).length;
  const totalCount = mensajes.length;

  const latestMessageDate =
    sortedMensajes.length > 0
      ? formatDate(sortedMensajes[0].createdAt)
      : "Sin mensajes";

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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a1628] text-white">
        <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-[#009B8D]/20" />

          <p className="font-semibold text-slate-400">Cargando mensajes...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      <header className="border-b border-[#009B8D]/10 bg-[#08111f] px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-[1760px] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#009B8D]">
              Panel administrativo
            </p>

            <h1 className="mt-1 text-3xl font-black md:text-4xl">
              Mensajes de contacto
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Revisa las consultas enviadas desde el formulario público,
              responde por correo, marca mensajes como leídos o elimina los que
              ya no necesites.
            </p>

            <p className="mt-2 wrap-anywhere text-xs text-slate-500">
              Sesión iniciada como {user?.email}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-white/5"
            >
              <ArrowLeft size={16} />
              Volver al dashboard
            </Link>

            <span className="rounded-2xl border border-[#009B8D]/20 bg-[#009B8D]/10 px-5 py-3 text-center text-sm font-black text-[#20d6c7]">
              {unreadCount} sin leer
            </span>
          </div>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-[1760px]">
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <StatCard label="Total mensajes" value={String(totalCount)} />
            <StatCard label="Sin leer" value={String(unreadCount)} />
            <StatCard label="Leídos" value={String(readCount)} />
            <StatCard label="Último mensaje" value={latestMessageDate} small />
          </div>

          {sortedMensajes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-5">
              {sortedMensajes.map((mensaje) => (
                <MessageCard
                  key={mensaje.id}
                  mensaje={mensaje}
                  onToggleRead={() => handleToggleRead(mensaje)}
                  onDelete={() => handleDelete(mensaje.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function MessageCard({
  mensaje,
  onToggleRead,
  onDelete,
}: {
  mensaje: MensajeContacto;
  onToggleRead: () => void;
  onDelete: () => void;
}) {
  const isUnread = !Boolean(mensaje.read);

  return (
    <article
      className={`overflow-hidden rounded-[2rem] border shadow-[0_24px_80px_rgba(0,0,0,0.16)] transition hover:border-[#009B8D]/40 ${
        isUnread
          ? "border-[#009B8D]/35 bg-linear-to-br from-[#0f2744] to-[#082f2b]"
          : "border-[#009B8D]/15 bg-[#0f2744]"
      }`}
    >
      <div className="grid gap-0 xl:grid-cols-[1fr_260px]">
        <div className="p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${
                    isUnread
                      ? "bg-[#009B8D] text-white"
                      : "border border-white/10 bg-white/5 text-slate-400"
                  }`}
                >
                  {isUnread ? (
                    <EyeOff size={13} strokeWidth={2.2} />
                  ) : (
                    <Eye size={13} strokeWidth={2.2} />
                  )}

                  {isUnread ? "Nuevo" : "Leído"}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                  <Clock size={13} />
                  {formatDate(mensaje.createdAt)}
                </span>
              </div>

              <h2 className="mb-4 wrap-anywhere text-2xl font-black leading-tight text-white">
                {mensaje.subject || "Sin asunto"}
              </h2>

              <div className="mb-5 grid gap-3 text-sm md:grid-cols-3">
                <InfoChip
                  Icon={UserRound}
                  label="Nombre"
                  value={mensaje.name || "No indicado"}
                />

                <InfoChip
                  Icon={Mail}
                  label="Correo"
                  value={mensaje.email || "No indicado"}
                  href={mensaje.email ? `mailto:${mensaje.email}` : undefined}
                />

                <InfoChip
                  Icon={Phone}
                  label="Teléfono"
                  value={mensaje.phone || "No indicado"}
                  href={mensaje.phone ? `tel:${mensaje.phone}` : undefined}
                />
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-[#08111f]/80 p-5">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#009B8D]">
                  Mensaje
                </p>

                <p className="whitespace-pre-wrap wrap-anywhere leading-8 text-slate-300">
                  {mensaje.message || "Sin mensaje escrito."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="border-t border-white/10 bg-[#08111f]/70 p-5 sm:p-6 xl:border-l xl:border-t-0">
          <div className="mb-5 rounded-[1.5rem] border border-white/10 bg-[#0a1628]/70 p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Estado
            </p>

            <p
              className={`font-black ${
                isUnread ? "text-[#20d6c7]" : "text-white"
              }`}
            >
              {isUnread ? "Pendiente de revisión" : "Mensaje leído"}
            </p>
          </div>

          <div className="grid gap-3">
            <button
              type="button"
              onClick={onToggleRead}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#009B8D]/30 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#009B8D]/10"
            >
              {isUnread ? <Eye size={17} /> : <EyeOff size={17} />}
              {isUnread ? "Marcar leído" : "Marcar no leído"}
            </button>

            <a
              href={createMailtoReply(mensaje)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#009B8D] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#00877a]"
            >
              <Reply size={17} />
              Responder
            </a>

            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 px-5 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/10"
            >
              <Trash2 size={17} />
              Eliminar
            </button>
          </div>
        </aside>
      </div>
    </article>
  );
}

function InfoChip({
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
    <div className="flex h-full gap-3 rounded-[1.25rem] border border-white/10 bg-[#08111f]/70 p-4 transition hover:bg-white/5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#009B8D]/15 text-[#20d6c7]">
        <Icon size={18} strokeWidth={1.8} />
      </div>

      <div className="min-w-0">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>

        <p className="wrap-anywhere text-sm font-black text-white">{value}</p>
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <a href={href} className="block h-full">
      {content}
    </a>
  );
}

function StatCard({
  label,
  value,
  small = false,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#009B8D]/15 bg-[#0f2744] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 wrap-anywhere font-black text-white ${
          small ? "text-lg leading-7" : "text-3xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-[#009B8D]/15 bg-[#0f2744] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#009B8D]/15 text-[#20d6c7]">
        <Inbox size={30} strokeWidth={1.8} />
      </div>

      <h2 className="mb-2 text-2xl font-black">No hay mensajes todavía</h2>

      <p className="mx-auto max-w-xl text-slate-400">
        Cuando alguien complete el formulario de contacto, aparecerá en esta
        sección para que puedas revisarlo, responderlo o marcarlo como leído.
      </p>
    </div>
  );
}