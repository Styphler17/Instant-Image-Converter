import { useState, useEffect } from "react";
import { type ImageInfo, type ConversionResult, formatBytes, formatName } from "@/lib/image-converter";
import { ArrowRight, TrendingDown, TrendingUp, Clock, SlidersHorizontal, LayoutGrid, Palette, AlertCircle, Share2 } from "lucide-react";
import { ComparisonSlider } from "@/components/ComparisonSlider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { extractColors, type ColorPalette } from "@/lib/color-utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface PreviewPaneProps {
  imageInfo: ImageInfo;
  result: ConversionResult | null;
}

export function PreviewPane({ imageInfo, result }: PreviewPaneProps) {
  const [viewMode, setViewMode] = useState<"sideBySide" | "comparison">("sideBySide");
  const [colors, setColors] = useState<ColorPalette | null>(null);

  const sizeChange = result
    ? ((result.convertedSize - result.originalSize) / result.originalSize) * 100
    : null;

  const isJpgToPng = imageInfo.format.toLowerCase().includes("jpeg") && result?.format === "image/png";
  const isSizeSignificantIncrease = sizeChange !== null && sizeChange > 50;

  useEffect(() => {
    extractColors(imageInfo.url)
      .then(setColors)
      .catch(() => setColors(null));
  }, [imageInfo.url]);

  const handleShare = async () => {
    if (!result) return;
    
    const reduction = sizeChange && sizeChange < 0 ? Math.abs(sizeChange).toFixed(1) : 0;
    const text = reduction 
      ? `I just saved ${reduction}% in file size using Instant Image Converter! 🚀 100% private, browser-based conversion.`
      : `I just converted my images to ${formatName(result.format)} instantly using Instant Image Converter! 🖼️`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Instant Image Converter',
          text: text,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        toast.success("Summary copied to clipboard!");
      }
    } catch (e) {
      // User cancelled
    }
  };

  const renderSizeWarning = () => {
    if (!result || !isSizeSignificantIncrease) return null;

    return (
      <Alert variant="destructive" className="bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400 animate-in fade-in slide-in-from-top-2 duration-500 rounded-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-xs font-bold uppercase tracking-wider mb-1">
          {isJpgToPng ? "JPG to PNG Size Warning" : "File Size Notice"}
        </AlertTitle>
        <AlertDescription className="text-[11px] leading-relaxed font-medium">
          {isJpgToPng ? (
            <>
              PNG is <span className="font-bold underline decoration-orange-500/30">lossless</span> and stores every pixel exactly, making photos <span className="font-bold text-red-500">2–10x larger</span> than JPG. 
              Use PNG only for transparency. For small files, try <span className="font-bold text-emerald-500 underline decoration-emerald-500/30">WebP</span> instead.
            </>
          ) : (
            <>
              Converting from lossy formats to lossless formats or applying enhancements can significantly increase file size. 
              For smaller files with similar quality, try using <span className="font-bold text-emerald-500">WebP</span> or <span className="font-bold text-emerald-500">AVIF</span> instead.
            </>
          )}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-6">
      {/* File Size Warning */}
      {renderSizeWarning()}

      {/* View mode toggle when result is available */}
      {result && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/40">
            <Button
              variant={viewMode === "sideBySide" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("sideBySide")}
              className={cn("gap-1.5 text-[10px] font-bold uppercase tracking-wider h-8 rounded-lg transition-all", viewMode === "sideBySide" ? "shadow-sm" : "")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Side by side
            </Button>
            <Button
              variant={viewMode === "comparison" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("comparison")}
              className={cn("gap-1.5 text-[10px] font-bold uppercase tracking-wider h-8 rounded-lg transition-all", viewMode === "comparison" ? "shadow-sm" : "")}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Comparison
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 text-[10px] font-bold uppercase tracking-wider h-8 rounded-lg border-border/60 hover:bg-primary/5 transition-all"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share Stats
            </Button>
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-background/50 px-2 py-1 rounded-md border border-border/40 h-8">
              <Clock className="h-3 w-3" />
              <span>{result.conversionTimeMs.toFixed(0)}ms</span>
            </div>
          </div>
        </div>
      )}

      {/* Image previews */}
      {result && viewMode === "comparison" ? (
        <ComparisonSlider
          originalUrl={imageInfo.url}
          convertedUrl={result.url}
          originalLabel={formatName(imageInfo.format)}
          convertedLabel={formatName(result.format)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Original */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Original Source</p>
               <div className="flex items-center gap-2">
                 <span className="px-1.5 py-0.5 rounded bg-muted text-[9px] font-black text-muted-foreground border border-border/40 uppercase">
                   {(imageInfo.file as any).originalFormatLabel ? `${(imageInfo.file as any).originalFormatLabel} SOURCE` : formatName(imageInfo.format)}
                 </span>
                 <span className="text-[10px] font-bold text-primary/60">{imageInfo.width}×{imageInfo.height}</span>
               </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-inner">
              <img
                src={imageInfo.url}
                alt="Original"
                className="w-full object-contain max-h-80 transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md glass text-[10px] font-bold">{formatBytes(imageInfo.file.size)}</div>
            </div>
          </div>

          {/* Converted */}
          {result && (
            <div className="space-y-3 animate-pop-in">
              <div className="flex items-center justify-between px-1">
                 <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Optimized Result</p>
                 <span className="text-[10px] font-bold text-primary/60">{result.width}×{result.height}</span>
              </div>
              <div className="relative group overflow-hidden rounded-2xl border-2 border-primary/20 bg-primary/5 shadow-inner">
                <img
                  src={result.url}
                  alt="Converted"
                  className="w-full object-contain max-h-80 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold shadow-lg">{formatBytes(result.convertedSize)}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats and Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Extracted Colors */}
        {colors && (
          <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card p-4 animate-pop-in shadow-sm">
             <div className="p-2 rounded-xl bg-muted/50">
               <Palette className="h-5 w-5 text-muted-foreground" />
             </div>
             <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Color Palette</p>
                <div className="flex gap-1.5 h-6">
                  <div 
                    className="flex-1 rounded-md shadow-sm border border-black/5" 
                    style={{ backgroundColor: colors.dominant }} 
                    title={colors.dominant} 
                  />
                  {colors.palette.map((c, i) => (
                    <div 
                      key={i} 
                      className="w-6 rounded-md shadow-sm border border-black/5 hover:scale-110 transition-transform" 
                      style={{ backgroundColor: c }} 
                      title={c} 
                    />
                  ))}
                </div>
             </div>
          </div>
        )}

        {/* Stats bar */}
        {result && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 animate-pop-in shadow-sm">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-xl shadow-sm",
                sizeChange !== null && sizeChange < 0 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
              )}>
                 {sizeChange !== null && sizeChange < 0 ? (
                   <TrendingDown className="h-5 w-5" />
                 ) : (
                   <TrendingUp className="h-5 w-5" />
                 )}
              </div>
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Optimization</p>
                 <p className={cn("text-base font-bold", sizeChange !== null && sizeChange < 0 ? "text-success" : "text-foreground")}>
                   {sizeChange !== null
                     ? sizeChange < 0
                       ? `${Math.abs(sizeChange).toFixed(1)}% Reduction`
                       : `${sizeChange.toFixed(1)}% Larger`
                     : ""}
                 </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-background/50 px-4 py-2 rounded-xl border border-border/40">
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">Before</p>
                <p className="text-sm font-bold opacity-60">{formatBytes(imageInfo.file.size)}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-primary animate-pulse" />
              <div>
                <p className="text-[10px] font-bold text-primary uppercase">After</p>
                <p className="text-sm font-bold text-primary">{formatBytes(result.convertedSize)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
