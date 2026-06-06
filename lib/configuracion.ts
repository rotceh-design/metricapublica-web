import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  ConfiguracionGlobal,
  defaultConfiguracionGlobal,
} from "@/types/configuracion";

const configuracionRef = doc(db, "configuracion", "global");

export async function getConfiguracionGlobal(): Promise<ConfiguracionGlobal> {
  const snapshot = await getDoc(configuracionRef);

  if (!snapshot.exists()) {
    return defaultConfiguracionGlobal;
  }

  return {
    ...defaultConfiguracionGlobal,
    ...snapshot.data(),
  } as ConfiguracionGlobal;
}

export async function updateConfiguracionGlobal(data: ConfiguracionGlobal) {
  return setDoc(
    configuracionRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}