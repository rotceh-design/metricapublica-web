import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  ContenidoGlobal,
  defaultContenidoGlobal,
} from "@/types/contenidoGlobal";

const contenidoGlobalRef = doc(db, "contenido", "global");

export async function getContenidoGlobal(): Promise<ContenidoGlobal> {
  const snapshot = await getDoc(contenidoGlobalRef);

  if (!snapshot.exists()) {
    return defaultContenidoGlobal;
  }

  return {
    ...defaultContenidoGlobal,
    ...snapshot.data(),
  } as ContenidoGlobal;
}

export async function updateContenidoGlobal(data: ContenidoGlobal) {
  return setDoc(
    contenidoGlobalRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}