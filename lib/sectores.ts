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
import { Sector, SectorFormData } from "@/types/sector";

const sectoresRef = collection(db, "sectores");

export function createSectorSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getSectores() {
  const snapshot = await getDocs(sectoresRef);

  const sectores = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Sector[];

  return sectores.sort((a, b) => {
    const orderA = Number(a.order || 0);
    const orderB = Number(b.order || 0);

    return orderA - orderB;
  });
}

export async function getActiveSectores() {
  const sectores = await getSectores();

  return sectores.filter((sector) => sector.active);
}

export async function getSector(id: string) {
  const documentRef = doc(db, "sectores", id);
  const snapshot = await getDoc(documentRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Sector;
}

export async function getActiveSectorBySlug(slug: string) {
  const q = query(
    sectoresRef,
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
  } as Sector;
}

export async function createSector(data: SectorFormData) {
  return addDoc(sectoresRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateSector(id: string, data: SectorFormData) {
  const documentRef = doc(db, "sectores", id);

  return updateDoc(documentRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSector(id: string) {
  const documentRef = doc(db, "sectores", id);

  return deleteDoc(documentRef);
}