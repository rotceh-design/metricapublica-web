import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Servicio, ServicioFormData } from "@/types/servicio";

const serviciosRef = collection(db, "servicios");

export function createServiceSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getServicios() {
  const snapshot = await getDocs(serviciosRef);

  const servicios = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Servicio[];

  return servicios.sort((a, b) => {
    const orderA = Number(a.order || 0);
    const orderB = Number(b.order || 0);

    return orderA - orderB;
  });
}

export async function getActiveServicios() {
  const servicios = await getServicios();

  return servicios.filter((servicio) => servicio.active);
}

export async function getServicio(id: string) {
  const documentRef = doc(db, "servicios", id);
  const snapshot = await getDoc(documentRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Servicio;
}

export async function createServicio(data: ServicioFormData) {
  return addDoc(serviciosRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateServicio(id: string, data: ServicioFormData) {
  const documentRef = doc(db, "servicios", id);

  return updateDoc(documentRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteServicio(id: string) {
  const documentRef = doc(db, "servicios", id);
  return deleteDoc(documentRef);
}