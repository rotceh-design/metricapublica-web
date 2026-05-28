import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { MensajeContacto, MensajeContactoFormData } from "@/types/mensaje";

const mensajesRef = collection(db, "mensajesContacto");

export async function createMensajeContacto(data: MensajeContactoFormData) {
  return addDoc(mensajesRef, {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
}

export async function getMensajesContacto() {
  const q = query(mensajesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as MensajeContacto[];
}

export async function markMensajeAsRead(id: string) {
  const documentRef = doc(db, "mensajesContacto", id);

  return updateDoc(documentRef, {
    read: true,
  });
}

export async function markMensajeAsUnread(id: string) {
  const documentRef = doc(db, "mensajesContacto", id);

  return updateDoc(documentRef, {
    read: false,
  });
}

export async function deleteMensajeContacto(id: string) {
  const documentRef = doc(db, "mensajesContacto", id);

  return deleteDoc(documentRef);
}