import { useState, useCallback, useRef } from "react";
import {
  type OutputFormat,
  type ImageInfo,
  type ConversionResult,
  type ConversionOptions,
  type ResizeOptions,
  type EnhancementOptions,
  type WatermarkOptions,
  DEFAULT_RESIZE_OPTIONS,
  DEFAULT_ENHANCEMENT_OPTIONS,
  DEFAULT_WATERMARK_OPTIONS,
  loadImage,
  convertImage,
} from "@/lib/image-converter";

export type ConversionState = "idle" | "loading" | "ready" | "converting" | "done" | "error";

export interface BatchItem {
  id: string;
  imageInfo: ImageInfo;
  result: ConversionResult | null;
  state: ConversionState;
  error: string | null;
}

export function useImageConversion() {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [globalState, setGlobalState] = useState<ConversionState>("idle");
  const [error, setError] = useState<string | null>(null);
  
  // Conversion Settings
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState(0.85);
  const [resize, setResize] = useState<ResizeOptions>(DEFAULT_RESIZE_OPTIONS);
  const [enhancements, setEnhancements] = useState<EnhancementOptions>(DEFAULT_ENHANCEMENT_OPTIONS);
  const [watermark, setWatermark] = useState<WatermarkOptions>(DEFAULT_WATERMARK_OPTIONS);
  const [removeExif, setRemoveExif] = useState(true);
  const [optimize, setOptimize] = useState(true);
  const [batchPrefix, setBatchPrefix] = useState("");

  const [activeIndex, setActiveIndex] = useState(0);
  const resultUrls = useRef<string[]>([]);

  const cleanupUrls = useCallback(() => {
    resultUrls.current.forEach((u) => URL.revokeObjectURL(u));
    resultUrls.current = [];
  }, []);

  const handleFiles = useCallback(async (files: File[]) => {
    setGlobalState("loading");
    setError(null);
    cleanupUrls();

    try {
      const loaded: BatchItem[] = [];
      for (const file of files) {
        try {
          const info = await loadImage(file);
          loaded.push({
            id: crypto.randomUUID(),
            imageInfo: info,
            result: null,
            state: "ready",
            error: null,
          });
        } catch (e) {
          loaded.push({
            id: crypto.randomUUID(),
            imageInfo: { file, url: "", width: 0, height: 0, format: file.type } as ImageInfo,
            result: null,
            state: "error",
            error: e instanceof Error ? e.message : "Failed to load image.",
          });
        }
      }
      setItems(loaded);
      setActiveIndex(0);

      const firstValid = loaded.find((i) => i.state === "ready");
      if (firstValid) {
        setResize({
          ...DEFAULT_RESIZE_OPTIONS,
          width: firstValid.imageInfo.width,
          height: firstValid.imageInfo.height,
        });
      }

      setGlobalState("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load images.");
      setGlobalState("error");
    }
  }, [cleanupUrls]);

  const convert = useCallback(async () => {
    if (items.length === 0) return;
    setGlobalState("converting");
    setError(null);
    cleanupUrls();

    const options: ConversionOptions = { 
      outputFormat, 
      quality, 
      resize,
      enhancements,
      watermark,
      removeExif,
      optimize
    };
    const updated = [...items];

    for (let i = 0; i < updated.length; i++) {
      if (updated[i].state === "error" && !updated[i].imageInfo.url) continue;

      updated[i] = { ...updated[i], state: "converting" };
      setItems([...updated]);

      try {
        const convResult = await convertImage(updated[i].imageInfo, options);
        resultUrls.current.push(convResult.url);
        updated[i] = { ...updated[i], result: convResult, state: "done" };
      } catch (e) {
        updated[i] = {
          ...updated[i],
          state: "error",
          error: e instanceof Error ? e.message : "Conversion failed.",
        };
      }
      setItems([...updated]);
    }

    const allDone = updated.every((item) => item.state === "done" || item.state === "error");
    setGlobalState(allDone ? "done" : "error");
  }, [items, outputFormat, quality, resize, enhancements, watermark, removeExif, optimize, cleanupUrls]);

  const reset = useCallback(() => {
    items.forEach((item) => {
      if (item.imageInfo?.url) URL.revokeObjectURL(item.imageInfo.url);
    });
    cleanupUrls();
    setItems([]);
    setError(null);
    setGlobalState("idle");
    setActiveIndex(0);
    setResize(DEFAULT_RESIZE_OPTIONS);
    setEnhancements(DEFAULT_ENHANCEMENT_OPTIONS);
    setWatermark(DEFAULT_WATERMARK_OPTIONS);
    setOptimize(true);
    setBatchPrefix("");
  }, [items, cleanupUrls]);

  const activeItem = items[activeIndex] || null;
  const imageInfo = activeItem?.imageInfo || null;
  const result = activeItem?.result || null;

  return {
    state: globalState,
    items,
    activeIndex,
    setActiveIndex,
    imageInfo,
    result,
    error,
    outputFormat,
    setOutputFormat,
    quality,
    setQuality,
    resize,
    setResize,
    enhancements,
    setEnhancements,
    watermark,
    setWatermark,
    removeExif,
    setRemoveExif,
    optimize,
    setOptimize,
    batchPrefix,
    setBatchPrefix,
    handleFiles,
    convert,
    reset,
  };
}
