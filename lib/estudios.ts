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
import { Estudio, EstudioFormData } from "@/types/estudio";

const estudiosRef = collection(db, "estudios");

export function createStudySlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getEstudios() {
  const snapshot = await getDocs(estudiosRef);

  const estudios = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Estudio[];

  return estudios.sort((a, b) => {
    const yearA = Number(a.year || 0);
    const yearB = Number(b.year || 0);

    return yearB - yearA;
  });
}

export async function getPublishedEstudios() {
  const q = query(estudiosRef, where("status", "==", "published"));
  const snapshot = await getDocs(q);

  const estudios = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Estudio[];

  return estudios.sort((a, b) => {
    const yearA = Number(a.year || 0);
    const yearB = Number(b.year || 0);

    return yearB - yearA;
  });
}

export async function getEstudio(id: string) {
  const documentRef = doc(db, "estudios", id);
  const snapshot = await getDoc(documentRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Estudio;
}

export async function getPublishedEstudioBySlug(slug: string) {
  const q = query(
    estudiosRef,
    where("slug", "==", slug),
    where("status", "==", "published"),
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
  } as Estudio;
}

export async function createEstudio(data: EstudioFormData) {
  return addDoc(estudiosRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateEstudio(id: string, data: EstudioFormData) {
  const documentRef = doc(db, "estudios", id);

  return updateDoc(documentRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEstudio(id: string) {
  const documentRef = doc(db, "estudios", id);
  return deleteDoc(documentRef);
}

// Type: estudios module is complete
