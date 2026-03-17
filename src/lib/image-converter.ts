import heic2any from "heic2any";

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

export interface EnhancementOptions {
  brightness: number; // 0-200, 100 is normal
  contrast: number; // 0-200, 100 is normal
  saturation: number; // 0-200, 100 is normal
}

export interface WatermarkOptions {
  enabled: boolean;
  text: string;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";
  opacity: number; // 0-1
}

export interface ConversionOptions {
  outputFormat: OutputFormat;
  quality: number;
  resize: ResizeOptions;
  enhancements?: EnhancementOptions;
  watermark?: WatermarkOptions;
  removeExif?: boolean; // Always true via canvas, but good to have in options
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

export function getOutputFilename(originalName: string, format: OutputFormat, prefix: string = ""): string {
  const base = originalName.replace(/\.[^.]+$/, "");
  const name = prefix ? `${prefix}${base}` : base;
  return `${name}.${getExtension(format)}`;
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
  return new Promise(async (resolve, reject) => {
    if (file.size > 30 * 1024 * 1024) {
      reject(new Error("File too large. Maximum size is 30 MB."));
      return;
    }

    let targetFile = file;
    const isHEIC = file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif") || file.type === "image/heic" || file.type === "image/heif";

    if (isHEIC) {
      try {
        const converted = await heic2any({
          blob: file,
          toType: "image/png",
        });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        targetFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, ".png"), { type: "image/png" });
      } catch (e) {
        reject(new Error("Failed to process HEIC file."));
        return;
      }
    }

    const url = URL.createObjectURL(targetFile);
    const img = new Image();

    img.onload = () => {
      resolve({
        file: targetFile,
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: targetFile.type || guessFormat(targetFile.name),
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

  // Apply Enhancements
  if (options.enhancements) {
    const { brightness, contrast, saturation } = options.enhancements;
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  }

  if (options.outputFormat === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  // Drawing to canvas inherently strips EXIF metadata
  ctx.drawImage(img, 0, 0, width, height);

  // Apply Watermark
  if (options.watermark && options.watermark.enabled && options.watermark.text) {
    ctx.filter = "none"; // Reset filter for watermark
    ctx.globalAlpha = options.watermark.opacity;
    ctx.fillStyle = "white";
    
    // Scale font size based on image width
    const fontSize = Math.max(12, Math.floor(width * 0.05));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textBaseline = "middle";
    
    const textMetrics = ctx.measureText(options.watermark.text);
    const padding = fontSize;
    
    let x = 0;
    let y = 0;

    switch (options.watermark.position) {
      case "bottom-right":
        x = width - textMetrics.width - padding;
        y = height - padding;
        break;
      case "bottom-left":
        x = padding;
        y = height - padding;
        break;
      case "top-right":
        x = width - textMetrics.width - padding;
        y = padding + fontSize / 2;
        break;
      case "top-left":
        x = padding;
        y = padding + fontSize / 2;
        break;
      case "center":
        x = (width - textMetrics.width) / 2;
        y = height / 2;
        break;
    }

    // Add slight shadow for visibility
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.fillText(options.watermark.text, x, y);
    
    ctx.globalAlpha = 1.0;
    ctx.shadowColor = "transparent";
  }

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

export const ACCEPTED_INPUT_TYPES = "image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp,image/tiff,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp,.tiff,.tif,.heic,.heif";

export function formatName(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "JPEG", "image/png": "PNG", "image/webp": "WebP",
    "image/avif": "AVIF", "image/gif": "GIF", "image/bmp": "BMP",
    "image/tiff": "TIFF", "image/heic": "HEIC", "image/heif": "HEIF",
    "image/unknown": "Unknown",
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

export const DEFAULT_ENHANCEMENT_OPTIONS: EnhancementOptions = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

export const DEFAULT_WATERMARK_OPTIONS: WatermarkOptions = {
  enabled: false,
  text: "My Watermark",
  position: "bottom-right",
  opacity: 0.5,
};
