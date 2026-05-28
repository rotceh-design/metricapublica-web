export type ImageCompressionResult = {
  file: File;
  originalSize: number;
  compressedSize: number;
  savedPercent: number;
  wasCompressed: boolean;
};

type CompressImageOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  outputType?: "image/webp" | "image/jpeg";
};

function getFileExtension(mimeType: string) {
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/jpeg") return "jpg";
  return "jpg";
}

function cleanFileName(fileName: string) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo leer la imagen."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("No se pudo comprimir la imagen."));
          return;
        }

        resolve(blob);
      },
      type,
      quality
    );
  });
}

export async function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<ImageCompressionResult> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.72,
    outputType = "image/webp",
  } = options;

  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo debe ser una imagen.");
  }

  if (file.type === "image/heic" || file.type === "image/heif") {
    throw new Error(
      "El formato HEIC/HEIF no es compatible. En iPhone usa JPG, PNG o WebP."
    );
  }

  const originalSize = file.size;
  const image = await loadImage(file);

  const scale = Math.min(
    maxWidth / image.width,
    maxHeight / image.height,
    1
  );

  const targetWidth = Math.round(image.width * scale);
  const targetHeight = Math.round(image.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("No se pudo preparar la compresión de imagen.");
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  const blob = await canvasToBlob(canvas, outputType, quality);

  const extension = getFileExtension(outputType);
  const compressedName = `${cleanFileName(file.name)}-optimizada.${extension}`;

  const compressedFile = new File([blob], compressedName, {
    type: outputType,
    lastModified: Date.now(),
  });

  const compressedSize = compressedFile.size;

  if (compressedSize >= originalSize && originalSize < 900 * 1024) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      savedPercent: 0,
      wasCompressed: false,
    };
  }

  const savedPercent = Math.round(
    ((originalSize - compressedSize) / originalSize) * 100
  );

  return {
    file: compressedFile,
    originalSize,
    compressedSize,
    savedPercent,
    wasCompressed: true,
  };
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";

  const sizes = ["B", "KB", "MB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 1)} ${sizes[index]}`;
}