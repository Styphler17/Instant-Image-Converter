import { ActionButton } from "./ui/action-button";
import { Button } from "./ui/button";
import { RefreshCw, Download, Loader2, ImagePlus } from "lucide-react";
import { type ConversionResult, getOutputFilename } from "@/lib/image-converter";
import { type ConversionState } from "@/hooks/useImageConversion";

interface ConvertControlsProps {
  state: ConversionState;
  onConvert: () => void;
  onReset: () => void;
  result: ConversionResult | null;
  originalFileName: string;
}

export function ConvertControls({
  state,
  onConvert,
  onReset,
  result,
  originalFileName,
}: ConvertControlsProps) {
  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = getOutputFilename(originalFileName, result.format);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {state === "done" && result ? (
        <div className="flex flex-col gap-3">
          <ActionButton
            onClick={handleDownload}
            size="lg"
            showAnimation
            className="w-full gap-2 font-bold premium-gradient shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all py-6 text-base animate-pop-in rounded-full"
          >
            <Download className="h-5 w-5" />
            Download Result
          </ActionButton>
          
          <div className="flex gap-2">
            <Button
              onClick={onConvert}
              variant="outline"
              size="lg"
              className="flex-1 gap-2 border-border/60 hover:bg-muted/50 transition-colors rounded-full"
            >
              <RefreshCw className="h-4 w-4" />
              Re-convert
            </Button>
            <Button
              onClick={onReset}
              variant="ghost"
              size="lg"
              className="flex-1 gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-full"
            >
              <ImagePlus className="h-4 w-4" />
              Reset All
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <ActionButton
            onClick={onConvert}
            size="lg"
            showAnimation
            disabled={state === "converting" || state === "loading"}
            className="w-full gap-2 font-bold premium-gradient shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all py-6 text-base disabled:opacity-50 disabled:scale-100 rounded-full"
          >
            {state === "converting" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <RefreshCw className="h-5 w-5" />
            )}
            {state === "converting" ? "Converting..." : "Start Conversion"}
          </ActionButton>
          <Button
            onClick={onReset}
            variant="ghost"
            size="lg"
            className="w-full gap-2 hover:bg-muted/50 transition-colors rounded-full"
          >
            <ImagePlus className="h-4 w-4" />
            Add Different Image
          </Button>
        </div>
      )}
    </div>
  );
}
