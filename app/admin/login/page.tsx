"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [setupName, setSetupName] = useState("");
  const [setupEmail, setSetupEmail] = useState("");
  const [setupPassword, setSetupPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [error, setError] = useState("");
  const [setupMessage, setSetupMessage] = useState("");

  const [secretClicks, setSecretClicks] = useState(0);
  const [showSetup, setShowSetup] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  const handleSecretClick = () => {
    const nextClicks = secretClicks + 1;
    setSecretClicks(nextClicks);

    if (nextClicks >= 7) {
      setShowSetup(true);
      setSecretClicks(0);
    }
  };

  const createInitialCollections = async (uid: string) => {
    await setDoc(doc(db, "admins", uid), {
      uid,
      name: setupName,
      email: setupEmail,
      role: "superadmin",
      active: true,
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "siteSettings", "main"), {
      siteName: "Métrica Pública",
      slogan: "Investigación, datos y estrategia pública",
      email: "contacto@metricapublica.cl",
      domain: "metricapublica.cl",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, "servicios", "estudios-opinion-publica"), {
      title: "Estudios de opinión pública",
      slug: "estudios-opinion-publica",
      description:
        "Diseño, levantamiento y análisis de encuestas para medir percepciones, confianza, prioridades y evaluación ciudadana.",
      order: 1,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, "servicios", "analisis-territorial"), {
      title: "Análisis territorial",
      slug: "analisis-territorial",
      description:
        "Cruce de datos sociales, geográficos y comunales para diagnósticos locales, regionales o nacionales.",
      order: 2,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, "noticias", "bienvenida-nueva-web"), {
      title: "Nueva plataforma administrable de Métrica Pública",
      slug: "bienvenida-nueva-web",
      summary:
        "Esta noticia inicial confirma que la colección de noticias fue creada correctamente.",
      content:
        "Desde este panel se podrán crear, editar, publicar y eliminar noticias de Métrica Pública.",
      category: "Institucional",
      status: "draft",
      imageUrl: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, "estudios", "estudio-demostracion"), {
      title: "Estudio de demostración",
      slug: "estudio-demostracion",
      summary:
        "Este estudio inicial confirma que la colección de estudios fue creada correctamente.",
      content:
        "Desde este panel se podrán publicar estudios, informes, archivos PDF e imágenes.",
      category: "Opinión pública",
      year: "2025",
      status: "draft",
      imageUrl: "",
      pdfUrl: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, "equipo", "admin-inicial"), {
      name: setupName,
      role: "Administrador inicial",
      bio: "Usuario encargado de administrar la plataforma de Métrica Pública.",
      email: setupEmail,
      imageUrl: "",
      order: 1,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await setDoc(doc(db, "mensajesContacto", "mensaje-demostracion"), {
      name: "Sistema",
      email: "contacto@metricapublica.cl",
      phone: "",
      subject: "Mensaje de demostración",
      message:
        "Esta colección almacenará los mensajes enviados desde el formulario de contacto.",
      read: false,
      createdAt: serverTimestamp(),
    });
  };

  const handleCreateAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSetupMessage("");
    setSetupLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        setupEmail,
        setupPassword
      );

      await createInitialCollections(credential.user.uid);

      setSetupMessage(
        "Administrador creado y colecciones iniciales generadas correctamente."
      );

      setSetupName("");
      setSetupEmail("");
      setSetupPassword("");

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1200);
    } catch (error) {
      console.error(error);
      setSetupMessage(
        "No se pudo crear el administrador. Revisa Firebase Auth, Firestore y las credenciales."
      );
    } finally {
      setSetupLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0a1628] px-6 py-12 text-white">
      <section className="w-full max-w-md rounded-3xl border border-[#009B8D]/20 bg-[#0f2744]/80 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#009B8D] text-xl font-bold">
            MP
          </div>

          <h1 className="text-3xl font-bold">Acceso administrador</h1>

          <p className="mt-2 text-sm text-slate-400">
            Ingresa al panel privado de Métrica Pública.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Correo
            </label>
            <input
              type="email"
              placeholder="admin@metricapublica.cl"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#009B8D] px-6 py-4 font-bold text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <a
          href="/"
          className="mt-6 block text-center text-sm text-slate-400 transition hover:text-[#009B8D]"
        >
          Volver al sitio
        </a>
      </section>

      {showSetup && (
        <section className="fixed bottom-6 right-6 z-50 w-90 max-w-[calc(100vw-2rem)] rounded-3xl border border-[#009B8D]/30 bg-[#08111f] p-6 shadow-2xl">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#009B8D]">
                Setup inicial
              </p>
              <h2 className="mt-1 text-xl font-bold">
                Crear administrador
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Esto creará el usuario inicial y las colecciones base en
                Firestore.
              </p>
            </div>

            <button
              onClick={() => setShowSetup(false)}
              className="rounded-lg border border-white/10 px-3 py-1 text-sm text-slate-400 transition hover:text-white"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Nombre
              </label>
              <input
                type="text"
                value={setupName}
                onChange={(event) => setSetupName(event.target.value)}
                placeholder="Nombre del administrador"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Correo
              </label>
              <input
                type="email"
                value={setupEmail}
                onChange={(event) => setSetupEmail(event.target.value)}
                placeholder="admin@metricapublica.cl"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Contraseña
              </label>
              <input
                type="password"
                value={setupPassword}
                onChange={(event) => setSetupPassword(event.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#009B8D]"
                required
                minLength={6}
              />
            </div>

            {setupMessage && (
              <div className="rounded-xl border border-[#009B8D]/20 bg-[#009B8D]/10 px-4 py-3 text-xs leading-5 text-slate-200">
                {setupMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={setupLoading}
              className="w-full rounded-xl bg-[#009B8D] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#00877a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {setupLoading
                ? "Creando administrador..."
                : "Crear admin y colecciones"}
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={handleSecretClick}
        aria-label="Setup oculto"
        className="fixed bottom-2 right-2 z-40 h-4 w-4 rounded-full bg-transparent"
      />
    </main>
  );
}