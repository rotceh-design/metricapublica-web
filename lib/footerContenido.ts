import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  FooterContenido,
  defaultFooterContenido,
} from "@/types/footerContenido";

const footerContenidoRef = doc(db, "contenido", "footer");

export async function getFooterContenido(): Promise<FooterContenido> {
  const snapshot = await getDoc(footerContenidoRef);

  if (!snapshot.exists()) {
    return defaultFooterContenido;
  }

  return {
    ...defaultFooterContenido,
    ...snapshot.data(),
  } as FooterContenido;
}

export async function updateFooterContenido(data: FooterContenido) {
  return setDoc(
    footerContenidoRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}