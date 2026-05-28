import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { EquipoFormData, EquipoIntegrante } from "@/types/equipo";

const equipoRef = collection(db, "equipo");

export function createTeamSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getEquipo() {
  const snapshot = await getDocs(equipoRef);

  const equipo = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as EquipoIntegrante[];

  return equipo.sort((a, b) => {
    const orderA = Number(a.order || 0);
    const orderB = Number(b.order || 0);

    return orderA - orderB;
  });
}

export async function getActiveEquipo() {
  const equipo = await getEquipo();

  return equipo.filter((integrante) => integrante.active);
}

export async function getIntegranteEquipo(id: string) {
  const documentRef = doc(db, "equipo", id);
  const snapshot = await getDoc(documentRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as EquipoIntegrante;
}

export async function getActiveIntegranteBySlug(slug: string) {
  const q = query(
    equipoRef,
    where("slug", "==", slug),
    where("active", "==", true),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const document = snapshot.docs[0];

  return {
    id: document.id,
    ...document.data(),
  } as EquipoIntegrante;
}

export async function createIntegranteEquipo(data: EquipoFormData) {
  return addDoc(equipoRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateIntegranteEquipo(id: string, data: EquipoFormData) {
  const documentRef = doc(db, "equipo", id);

  return updateDoc(documentRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteIntegranteEquipo(id: string) {
  const documentRef = doc(db, "equipo", id);

  return deleteDoc(documentRef);
}