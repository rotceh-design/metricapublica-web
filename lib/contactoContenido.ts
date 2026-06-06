import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  ContactoContenido,
  defaultContactoContenido,
} from "@/types/contactoContenido";

const contactoContenidoRef = doc(db, "contenido", "contacto");

export async function getContactoContenido(): Promise<ContactoContenido> {
  const snapshot = await getDoc(contactoContenidoRef);

  if (!snapshot.exists()) {
    return defaultContactoContenido;
  }

  return {
    ...defaultContactoContenido,
    ...snapshot.data(),
  } as ContactoContenido;
}

export async function updateContactoContenido(data: ContactoContenido) {
  return setDoc(
    contactoContenidoRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}