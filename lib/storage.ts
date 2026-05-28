import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { storage } from "@/lib/firebase";
import { compressImage, formatBytes } from "@/lib/image-compression";

type UploadProgressCallback = (progress: number) => void;

function cleanFileName(fileName: string) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function uploadFeaturedImage(
  file: File,
  folder = "noticias",
  onProgress?: UploadProgressCallback
) {
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen.");
  }

  const maxOriginalSizeInMB = 20;
  const maxOriginalSizeInBytes = maxOriginalSizeInMB * 1024 * 1024;

  if (file.size > maxOriginalSizeInBytes) {
    throw new Error(
      `La imagen original no puede superar los ${maxOriginalSizeInMB}MB.`
    );
  }

  const optimized = await compressImage(file, {
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 0.72,
    outputType: "image/webp",
  });

  console.info("Imagen optimizada:", {
    original: formatBytes(optimized.originalSize),
    final: formatBytes(optimized.compressedSize),
    ahorro: `${optimized.savedPercent}%`,
    comprimida: optimized.wasCompressed,
  });

  const uploadFile = optimized.file;
  const extension = uploadFile.name.split(".").pop() || "webp";
  const safeName = cleanFileName(uploadFile.name);

  const fileName = `${folder}/${Date.now()}-${safeName}.${extension}`;
  const storageRef = ref(storage, fileName);

  const uploadTask = uploadBytesResumable(storageRef, uploadFile, {
    contentType: uploadFile.type,
    customMetadata: {
      originalSize: String(optimized.originalSize),
      compressedSize: String(optimized.compressedSize),
      savedPercent: String(optimized.savedPercent),
      optimized: String(optimized.wasCompressed),
    },
  });

  return new Promise<string>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        if (onProgress) {
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadUrl);
      }
    );
  });
}

export async function uploadPdfFile(
  file: File,
  folder = "estudios-pdf",
  onProgress?: UploadProgressCallback
) {
  if (file.type !== "application/pdf") {
    throw new Error("El archivo debe ser un PDF.");
  }

  const maxSizeInMB = 30;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    throw new Error(`El PDF no puede superar los ${maxSizeInMB}MB.`);
  }

  const safeName = cleanFileName(file.name);
  const fileName = `${folder}/${Date.now()}-${safeName}.pdf`;
  const storageRef = ref(storage, fileName);

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
      size: String(file.size),
    },
  });

  return new Promise<{ url: string; name: string }>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        if (onProgress) {
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

        resolve({
          url: downloadUrl,
          name: file.name,
        });
      }
    );
  });
}