import { useState, useRef, useCallback, useEffect } from "react";

interface ComparisonSliderProps {
  originalUrl: string;
  convertedUrl: string;
  originalLabel?: string;
  convertedLabel?: string;
}

export function ComparisonSlider({
  originalUrl,
  convertedUrl,
  originalLabel = "Original",
  convertedLabel = "Converted",
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    updateWidth();

    return () => observer.disconnect();
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement !== containerRef.current) return;
      if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 2));
      if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 2));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-border/40 shadow-xl cursor-col-resize select-none touch-none bg-muted animate-pop-in"
      style={{ aspectRatio: "auto" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      tabIndex={0}
      role="slider"
      aria-label="Before/after comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
    >
      {/* Converted (full background) */}
      <img
        src={convertedUrl}
        alt="Converted"
        className="block w-full object-contain max-h-96"
        draggable={false}
      />

      {/* Original (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden border-r-2 border-primary shadow-[10px_0_20px_-10px_rgba(0,0,0,0.2)]"
        style={{ width: `${position}%` }}
      >
        <img
          src={originalUrl}
          alt="Original"
          className="block object-contain max-h-96"
          style={{ width: containerWidth ? `${containerWidth}px` : "100%", maxWidth: "none" }}
          draggable={false}
        />
      </div>

      {/* Divider line / Handle */}
      <div
        className="absolute top-0 bottom-0 w-0"
        style={{ left: `${position}%` }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass border border-primary/30 text-primary flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
          <div className="flex gap-0.5">
            <div className="h-4 w-0.5 bg-primary rounded-full opacity-60" />
            <div className="h-4 w-0.5 bg-primary rounded-full" />
            <div className="h-4 w-0.5 bg-primary rounded-full opacity-60" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 rounded-full glass border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground pointer-events-none shadow-sm">
        {originalLabel}
      </div>
      <div className="absolute bottom-4 right-4 rounded-full glass border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground pointer-events-none shadow-sm">
        {convertedLabel}
      </div>
    </div>
  );
}
