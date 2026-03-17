import heic2any from "heic2any";
import imageCompression from "browser-image-compression";
import UTIF from "utif";
import { readPsd, drawPsd } from "ag-psd";

/**
 * Truly Universal Image Conversion Engine
 * High-performance browser-based processing for standard and professional formats.
 */

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp" | "image/avif" | "image/gif" | "image/bmp" | "image/tiff";
export type ResizeMode = "none" | "percentage" | "dimensions" | "preset";

export interface ResizeOptions {
  mode: ResizeMode;
  percentage: number;
  width: number;
  height: number;
  lockAspectRatio: boolean;
  upscale?: boolean;
}

export interface EnhancementOptions {
  enabled: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
}

export interface WatermarkOptions {
  enabled: boolean;
  text: string;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";
  opacity: number;
}

export interface ConversionOptions {
  outputFormat: OutputFormat;
  quality: number;
  resize: ResizeOptions;
  enhancements?: EnhancementOptions;
  watermark?: WatermarkOptions;
  removeExif?: boolean; 
  optimize?: boolean;
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
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
  "image/avif": "avif", "image/gif": "gif", "image/bmp": "bmp", "image/tiff": "tiff",
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
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1; canvas.height = 1;
    const formats: OutputFormat[] = ["image/png", "image/jpeg"];
    const testFormats: OutputFormat[] = ["image/webp", "image/avif", "image/gif", "image/bmp", "image/tiff"];
    
    for (const fmt of testFormats) {
      try {
        const dataUrl = canvas.toDataURL(fmt);
        if (dataUrl.startsWith(`data:${fmt}`)) formats.push(fmt as OutputFormat);
      } catch {}
    }
    if (!formats.includes("image/bmp")) formats.push("image/bmp");
    return [...new Set(formats)];
  } catch (e) {
    return ["image/png", "image/jpeg"];
  }
}

function encodeBMP(canvas: HTMLCanvasElement): Blob {
  const ctx = canvas.getContext("2d")!;
  const { width, height, data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const buffer = new ArrayBuffer(54 + width * height * 4);
  const view = new DataView(buffer);
  view.setUint16(0, 0x4D42, true); view.setUint32(2, 54 + width * height * 4, true); view.setUint32(10, 54, true);
  view.setUint32(14, 40, true); view.setUint32(18, width, true); view.setUint32(22, height, true); 
  view.setUint16(26, 1, true); view.setUint16(28, 32, true);
  let offset = 54;
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      view.setUint8(offset++, data[i+2]); view.setUint8(offset++, data[i+1]);
      view.setUint8(offset++, data[i]); view.setUint8(offset++, data[i+3]);
    }
  }
  return new Blob([buffer], { type: "image/bmp" });
}

export function loadImage(file: File): Promise<ImageInfo> {
  return new Promise(async (resolve, reject) => {
    const limit = 50 * 1024 * 1024;
    if (file.size > limit) return reject(new Error("File too large (Max 50MB)."));

    const name = file.name.toLowerCase();
    const extension = name.split(".").pop() || "";
    let targetFile: File | Blob = file;
    let originalFormatLabel = "";
    
    try {
      if (["heic", "heif"].includes(extension) || file.type.includes("heic")) {
        const converted = await heic2any({ blob: file, toType: "image/png" });
        const blob = Array.isArray(converted) ? converted[0] : converted;
        targetFile = new Blob([blob], { type: "image/png" });
        originalFormatLabel = "HEIC";
      } else if (extension === "psd" || file.type.includes("photoshop")) {
        const buffer = await file.arrayBuffer();
        const psd = readPsd(buffer);
        const canvas = psd.canvas;
        if (!canvas) throw new Error("Failed to render PSD canvas.");
        const blob = await new Promise<Blob>((res) => canvas.toBlob(b => res(b!), "image/png"));
        targetFile = blob;
        originalFormatLabel = "PSD";
      } else if (["tif", "tiff"].includes(extension)) {
        const buffer = await file.arrayBuffer();
        const ifds = UTIF.decode(buffer);
        UTIF.decodeImage(buffer, ifds[0]);
        const rgba = UTIF.toRGBA8(ifds[0]);
        const canvas = document.createElement("canvas");
        canvas.width = ifds[0].width; canvas.height = ifds[0].height;
        const ctx = canvas.getContext("2d")!;
        const imgData = ctx.createImageData(canvas.width, canvas.height);
        imgData.data.set(rgba);
        ctx.putImageData(imgData, 0, 0);
        const blob = await new Promise<Blob>((res) => canvas.toBlob(b => res(b!), "image/png"));
        targetFile = blob;
        originalFormatLabel = "TIFF";
      } else if (["cr2", "nef", "arw", "dng", "raw", "cr3"].includes(extension)) {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const foundJpegs: {start: number, end: number, size: number}[] = [];
        for (let i = 0; i < bytes.length - 2; i++) {
          if (bytes[i] === 0xFF && bytes[i + 1] === 0xD8 && bytes[i + 2] === 0xFF) {
            const start = i;
            for (let j = i + 2; j < bytes.length - 1; j++) {
              if (bytes[j] === 0xFF && bytes[j + 1] === 0xD9) {
                const end = j + 2;
                if (end - start > 5000) foundJpegs.push({ start, end, size: end - start });
                i = j; break;
              }
            }
          }
        }
        foundJpegs.sort((a, b) => b.size - a.size);
        if (foundJpegs.length > 0) {
          targetFile = new Blob([bytes.slice(foundJpegs[0].start, foundJpegs[0].end)], { type: "image/jpeg" });
          originalFormatLabel = extension.toUpperCase();
        } else throw new Error("No preview found.");
      }
    } catch (e) {
      console.warn("Specialized decoding failed:", e);
    }

    const url = URL.createObjectURL(targetFile);
    const img = new Image();
    
    img.onload = () => {
      const info: ImageInfo = {
        file: file,
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
        format: originalFormatLabel ? `image/${originalFormatLabel.toLowerCase()}` : (file.type || guessFormat(file.name))
      };
      if (originalFormatLabel) (info as any).originalFormatLabel = originalFormatLabel;
      resolve(info);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image preview. The format may be unsupported.`));
    };
    
    img.src = url;
  });
}

function guessFormat(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp",
    avif: "image/avif", gif: "image/gif", bmp: "image/bmp", tiff: "image/tiff",
    ico: "image/x-icon", psd: "image/vnd.adobe.photoshop",
  };
  return map[ext || ""] || "image/unknown";
}

function computeDimensions(origW: number, origH: number, resize: ResizeOptions) {
  if (resize.mode === "percentage") return { width: Math.max(1, Math.round(origW * (resize.percentage / 100))), height: Math.max(1, Math.round(origH * (resize.percentage / 100))) };
  if (resize.mode === "dimensions") return { width: Math.max(1, Math.round(resize.width)), height: Math.max(1, Math.round(resize.height)) };
  return { width: origW, height: origH };
}

export async function convertImage(imageInfo: ImageInfo, options: ConversionOptions): Promise<ConversionResult> {
  const start = performance.now();
  const img = new Image();
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error("Decode failed.")); img.src = imageInfo.url; });
  let { width, height } = computeDimensions(img.naturalWidth, img.naturalHeight, options.resize);
  const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
  if (options.enhancements?.enabled) {
    const { brightness, contrast, saturation } = options.enhancements;
    ctx.filter = `brightness(${brightness + 100}%) contrast(${contrast + 100}%) saturate(${saturation + 100}%)`;
  }
  if (options.outputFormat === "image/jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, width, height); }
  ctx.drawImage(img, 0, 0, width, height);
  if (options.watermark?.enabled && options.watermark.text) {
    ctx.filter = "none"; ctx.globalAlpha = options.watermark.opacity; ctx.fillStyle = "white";
    const fontSize = Math.max(12, Math.floor(width * 0.05)); ctx.font = `bold ${fontSize}px sans-serif`; ctx.textBaseline = "middle";
    const textMetrics = ctx.measureText(options.watermark.text);
    let x = 0, y = 0;
    const padding = fontSize;
    switch (options.watermark.position) {
      case "bottom-right": x = width - textMetrics.width - padding; y = height - padding; break;
      case "center": x = (width - textMetrics.width) / 2; y = height / 2; break;
      default: x = padding; y = padding;
    }
    ctx.shadowColor = "black"; ctx.shadowBlur = 4; ctx.fillText(options.watermark.text, x, y);
  }
  let blob: Blob;
  if (options.outputFormat === "image/bmp") blob = encodeBMP(canvas);
  else {
    blob = await new Promise<Blob>((res, rej) => {
      canvas.toBlob((b) => {
        if (b && (b.type === options.outputFormat || options.outputFormat === "image/tiff")) res(b);
        else rej(new Error("Format unsupported by browser."));
      }, options.outputFormat, options.quality);
    });
  }
  let finalBlob = blob;
  if (options.optimize && ["image/png", "image/jpeg", "image/webp"].includes(options.outputFormat)) {
    try {
      const optimized = await imageCompression(new File([blob], "temp", { type: blob.type }), { maxSizeMB: blob.size / 1048576, maxWidthOrHeight: Math.max(width, height), useWebWorker: true, initialQuality: options.quality });
      if (optimized.size < blob.size) finalBlob = optimized;
    } catch {}
  }
  return { blob: finalBlob, url: URL.createObjectURL(finalBlob), width, height, originalSize: imageInfo.file.size, convertedSize: finalBlob.size, conversionTimeMs: performance.now() - start, format: options.outputFormat };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024; const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const ACCEPTED_INPUT_TYPES = "image/*,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp,.tiff,.tif,.heic,.heif,.ico,.jfif,.psd,.tga,.nef,.raw,.arw,.cr2,.dng,.cr3";

export function formatName(mime: string): string {
  const map: Record<string, string> = { "image/jpeg": "JPEG", "image/png": "PNG", "image/webp": "WebP", "image/avif": "AVIF", "image/gif": "GIF", "image/bmp": "BMP", "image/tiff": "TIFF", "image/heic": "HEIC", "image/heif": "HEIF", "image/x-icon": "ICO", "image/vnd.adobe.photoshop": "PSD" };
  return map[mime] || mime.replace("image/", "").toUpperCase();
}

export const DEFAULT_RESIZE_OPTIONS: ResizeOptions = { mode: "none", percentage: 100, width: 0, height: 0, lockAspectRatio: true };
export const DEFAULT_ENHANCEMENT_OPTIONS: EnhancementOptions = { enabled: false, brightness: 0, contrast: 0, saturation: 0 };
export const DEFAULT_WATERMARK_OPTIONS: WatermarkOptions = { enabled: false, text: "My Watermark", position: "bottom-right", opacity: 0.5 };
