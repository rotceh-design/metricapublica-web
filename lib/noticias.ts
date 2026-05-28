import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Noticia, NoticiaFormData } from "@/types/noticia";

const noticiasRef = collection(db, "noticias");

export function createSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getNoticias() {
  const q = query(noticiasRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Noticia[];
}

export async function getPublishedNoticias() {
  const q = query(noticiasRef, where("status", "==", "published"));
  const snapshot = await getDocs(q);

  const noticias = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Noticia[];

  return noticias;
}

export async function getNoticia(id: string) {
  const documentRef = doc(db, "noticias", id);
  const snapshot = await getDoc(documentRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Noticia;
}

export async function getPublishedNoticiaBySlug(slug: string) {
  const q = query(
    noticiasRef,
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
  } as Noticia;
}

export async function createNoticia(data: NoticiaFormData) {
  return addDoc(noticiasRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateNoticia(id: string, data: NoticiaFormData) {
  const documentRef = doc(db, "noticias", id);

  return updateDoc(documentRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteNoticia(id: string) {
  const documentRef = doc(db, "noticias", id);
  return deleteDoc(documentRef);
}