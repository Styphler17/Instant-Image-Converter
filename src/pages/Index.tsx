import { AppShell } from "@/components/AppShell";
import { UploadArea } from "@/components/UploadArea";
import { FormatSelector } from "@/components/FormatSelector";
import { PreviewPane } from "@/components/PreviewPane";
import { ConvertControls } from "@/components/ConvertControls";
import { ProgressOverlay } from "@/components/ProgressOverlay";
import { ResizeControls } from "@/components/ResizeControls";
import { BatchThumbnails } from "@/components/BatchThumbnails";
import { useImageConversion } from "@/hooks/useImageConversion";
import { useCodecSupport } from "@/hooks/useCodecSupport";
import { getOutputFilename } from "@/lib/image-converter";
import { toast } from "sonner";
import { useEffect } from "react";
import { Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const {
    state,
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
    handleFiles,
    convert,
    reset,
  } = useImageConversion();

  const { supportedFormats } = useCodecSupport();

  useEffect(() => {
    if (state === "done") {
      const doneCount = items.filter((i) => i.state === "done").length;
      toast.success(`Conversion complete. ${doneCount} file${doneCount > 1 ? "s" : ""} ready to download.`);
    }
  }, [state, items]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const isIdle = state === "idle";

  const handleDownloadAll = () => {
    items.forEach((item) => {
      if (item.result) {
        const a = document.createElement("a");
        a.href = item.result.url;
        a.download = getOutputFilename(item.imageInfo.file.name, item.result.format);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  };

  return (
    <AppShell>
      <ProgressOverlay visible={state === "converting"} />

      <div className="container max-w-6xl py-12 sm:py-20">
        {isIdle ? (
          <div className="mx-auto max-w-2xl space-y-10 animate-pop-in">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                <Shield className="h-3 w-3" />
                Browser Native · Privacy First
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
                <span className="text-gradient">Convert instantly,</span>
                <br />
                <span className="opacity-80">anywhere.</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Professional-grade image conversion that runs 100% in your browser. No uploads, no waiting, just speed.
              </p>
            </div>

            <UploadArea onFiles={handleFiles} multiple />

            <div className="flex flex-col items-center justify-center gap-4 text-xs font-medium text-muted-foreground/60 italic">
              <p>Supports PNG, JPG, WebP, AVIF, GIF, BMP, and TIFF</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-5xl space-y-8 animate-pop-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
               <div>
                 <h2 className="text-2xl font-bold tracking-tight">Active Workspace</h2>
                 <p className="text-sm text-muted-foreground mt-1">Configure and convert your batch</p>
               </div>
               <Button onClick={reset} variant="ghost" size="sm" className="w-fit hover:bg-destructive/10 hover:text-destructive transition-colors">
                 Discard batch
               </Button>
            </div>

            {/* Batch thumbnails */}
            <div className="glass-card rounded-2xl p-4">
              <BatchThumbnails
                items={items}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
              />
            </div>

            {imageInfo && (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7 space-y-6">
                  <div className="glass-card rounded-2xl p-4 sm:p-6">
                    <PreviewPane imageInfo={imageInfo} result={result} />
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div className="glass-card rounded-2xl p-6 space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Output Settings</h3>
                      <div className="h-1 w-12 premium-gradient rounded-full" />
                    </div>
                    
                    <FormatSelector
                      outputFormat={outputFormat}
                      onFormatChange={setOutputFormat}
                      quality={quality}
                      onQualityChange={setQuality}
                      supportedFormats={supportedFormats}
                    />
                    
                    <div className="pt-6 border-t border-border/40">
                      <ResizeControls
                        resize={resize}
                        onChange={setResize}
                        originalWidth={imageInfo.width}
                        originalHeight={imageInfo.height}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="glass-card rounded-2xl p-4 bg-primary/5 border-primary/20">
                      <ConvertControls
                        state={state}
                        onConvert={convert}
                        onReset={reset}
                        result={result}
                        originalFileName={imageInfo.file.name}
                      />
                    </div>
                    
                    {/* Download All for batch */}
                    {state === "done" && items.length > 1 && items.some((i) => i.result) && (
                      <Button
                        onClick={handleDownloadAll}
                        variant="default"
                        size="lg"
                        className="gap-2 w-full premium-gradient shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all py-6 text-base font-bold"
                      >
                        <Download className="h-5 w-5" />
                        Download All ({items.filter((i) => i.result).length} files)
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Index;
