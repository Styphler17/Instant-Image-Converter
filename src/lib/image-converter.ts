/**
 * Core image conversion engine.
 * Uses Canvas API for encoding/decoding.
 */

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp" | "image/avif";

export type ResizeMode = "none" | "percentage" | "dimensions";

export interface ResizeOptions {
  mode: ResizeMode;
  percentage: number; // 1-200
  width: number;
  height: number;
  lockAspectRatio: boolean;
}

export interface ConversionOptions {
  outputFormat: OutputFormat;
  quality: number;
  resize: ResizeOptions;
}

export interface ConversionResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  originalSize: number;
  convertedSize: number;
  conversionTimeMs: number;
  format: OutputFormat;
}

export interface ImageInfo {
  file: File;
  url: string;
  width: number;
  height: number;
  format: string;
}

const FORMAT_EXTENSIONS: Record<OutputFormat, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export function getExtension(format: OutputFormat): string {
  return FORMAT_EXTENSIONS[format] || "bin";
}

export function getOutputFilename(originalName: string, format: OutputFormat): string {
  const base = originalName.replace(/\.[^.]+$/, "");
  return `${base}.${getExtension(format)}`;
}

export async function detectSupportedFormats(): Promise<OutputFormat[]> {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  if (!ctx) return ["image/png"];

  ctx.fillStyle = "#ff0000";
  ctx.fillRect(0, 0, 1, 1);

  const formats: OutputFormat[] = ["image/png"];
  const testFormats: OutputFormat[] = ["image/jpeg", "image/webp", "image/avif"];
  for (const fmt of testFormats) {
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, fmt, 0.9)
      );
      if (blob && blob.size > 0 && blob.type === fmt) {
        formats.push(fmt);
      }
    } catch {
      // Format not supported
    }
  }
  return formats;
}

export function loadImage(file: File): Promise<ImageInfo> {
  return new Promise((resolve, reject) => {
    if (file.size > 30 * 1024 * 1024) {
      reject(new Error("File too large. Maximum size is 30 MB."));
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({
        file,
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: file.type || guessFormat(file.name),
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image. The format may not be supported by your browser."));
    };

    img.src = url;
  });
}

function guessFormat(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    webp: "image/webp", avif: "image/avif", gif: "image/gif",
    bmp: "image/bmp", tiff: "image/tiff", tif: "image/tiff",
  };
  return map[ext || ""] || "image/unknown";
}

/** Compute final dimensions based on resize options */
function computeDimensions(
  origW: number, origH: number, resize: ResizeOptions
): { width: number; height: number } {
  if (resize.mode === "percentage") {
    const scale = resize.percentage / 100;
    return {
      width: Math.max(1, Math.round(origW * scale)),
      height: Math.max(1, Math.round(origH * scale)),
    };
  }
  if (resize.mode === "dimensions") {
    return {
      width: Math.max(1, Math.round(resize.width)),
      height: Math.max(1, Math.round(resize.height)),
    };
  }
  return { width: origW, height: origH };
}

export async function convertImage(
  imageInfo: ImageInfo,
  options: ConversionOptions
): Promise<ConversionResult> {
  const start = performance.now();

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to decode image for conversion."));
    img.src = imageInfo.url;
  });

  let { width, height } = computeDimensions(img.naturalWidth, img.naturalHeight, options.resize);

  const MAX_DIM = 16384;
  if (width > MAX_DIM || height > MAX_DIM) {
    const scale = Math.min(MAX_DIM / width, MAX_DIM / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable.");

  if (options.outputFormat === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);

  const quality = options.outputFormat === "image/png" ? undefined : options.quality;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error(`Failed to encode as ${options.outputFormat}.`));
      },
      options.outputFormat,
      quality
    );
  });

  const conversionTimeMs = performance.now() - start;

  return {
    blob,
    url: URL.createObjectURL(blob),
    width,
    height,
    originalSize: imageInfo.file.size,
    convertedSize: blob.size,
    conversionTimeMs,
    format: options.outputFormat,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const ACCEPTED_INPUT_TYPES = "image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp,image/tiff,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp,.tiff,.tif";

export function formatName(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "JPEG", "image/png": "PNG", "image/webp": "WebP",
    "image/avif": "AVIF", "image/gif": "GIF", "image/bmp": "BMP",
    "image/tiff": "TIFF", "image/unknown": "Unknown",
  };
  return map[mime] || mime.replace("image/", "").toUpperCase();
}

export const DEFAULT_RESIZE_OPTIONS: ResizeOptions = {
  mode: "none",
  percentage: 100,
  width: 0,
  height: 0,
  lockAspectRatio: true,
};
