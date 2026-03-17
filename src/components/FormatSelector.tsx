import { type OutputFormat, formatName } from "@/lib/image-converter";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormatSelectorProps {
  outputFormat: OutputFormat;
  onFormatChange: (format: OutputFormat) => void;
  quality: number;
  onQualityChange: (quality: number) => void;
  supportedFormats: OutputFormat[];
}

const ALL_FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/avif", label: "AVIF" },
  { value: "image/gif", label: "GIF" },
  { value: "image/bmp", label: "BMP" },
  { value: "image/tiff", label: "TIFF" },
];

const LOSSY_FORMATS: OutputFormat[] = ["image/jpeg", "image/webp", "image/avif", "image/tiff"];

const FORMAT_INFO: Record<OutputFormat, { pros: string; cons: string; size: string }> = {
  "image/jpeg": { pros: "Universal compatibility", cons: "No transparency, lossy", size: "Small" },
  "image/png": { pros: "Transparency, Lossless", cons: "Large file size for photos", size: "Large" },
  "image/webp": { pros: "Best for web, high compression", cons: "Older browser issues", size: "Tiny" },
  "image/avif": { pros: "Next-gen, best quality/size", cons: "Slow to encode, newest only", size: "Tiniest" },
  "image/gif": { pros: "Animation support (static here)", cons: "Limited to 256 colors", size: "Medium" },
  "image/bmp": { pros: "Perfect raw quality", cons: "No compression, massive size", size: "Massive" },
  "image/tiff": { pros: "Professional print standard", cons: "Huge size, limited web use", size: "Massive" },
};

export function FormatSelector({
  outputFormat,
  onFormatChange,
  quality,
  onQualityChange,
  supportedFormats,
}: FormatSelectorProps) {
  const isLossy = LOSSY_FORMATS.includes(outputFormat);
  const currentInfo = FORMAT_INFO[outputFormat];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="format-select" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Target Format
          </Label>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">SELECT ENGINE</span>
        </div>
        <Select
          value={outputFormat}
          onValueChange={(v) => onFormatChange(v as OutputFormat)}
        >
          <SelectTrigger id="format-select" className="w-full bg-background/50 border-border/60 focus:ring-primary/20 transition-all h-11 rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass border-border/60 rounded-2xl">
            {ALL_FORMATS.map(({ value, label }) => {
              const supported = supportedFormats.includes(value);
              return supported ? (
                <SelectItem key={value} value={value} className="focus:bg-primary/10 focus:text-primary transition-colors">
                  {label}
                </SelectItem>
              ) : (
                <div key={value} className="flex items-center px-2 py-1.5 text-xs text-muted-foreground cursor-not-allowed opacity-40 italic">
                  {label} (Unsupported by Browser)
                </div>
              );
            })}
          </SelectContent>
        </Select>

        {/* Format Info Card */}
        <div className="p-3 rounded-2xl bg-muted/30 border border-border/40 animate-pop-in">
           <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground/60 mb-1">Estimated Size</p>
                <p className={cn("text-xs font-bold", 
                  currentInfo.size === "Massive" ? "text-orange-500" : 
                  currentInfo.size === "Large" ? "text-blue-500" : "text-emerald-500"
                )}>
                  {currentInfo.size}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-muted-foreground/60 mb-1">Best Use</p>
                <p className="text-xs font-bold">{currentInfo.pros.split(',')[0]}</p>
              </div>
           </div>
           <div className="pt-2 border-t border-border/20">
              <p className="text-[10px] leading-relaxed italic text-muted-foreground font-medium">
                <span className="font-bold text-foreground/60">Note:</span> {currentInfo.cons}
              </p>
           </div>
        </div>
      </div>

      {isLossy && (
        <div className="space-y-4 animate-pop-in">
          <div className="flex items-center justify-between">
            <Label htmlFor="quality-slider" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Output Quality
            </Label>
            <div className="px-2 py-1 rounded-md bg-background border border-border/60 text-sm font-bold tabular-nums text-primary shadow-sm">
              {Math.round(quality * 100)}%
            </div>
          </div>
          <Slider
            id="quality-slider"
            min={1}
            max={100}
            step={1}
            value={[Math.round(quality * 100)]}
            onValueChange={([v]) => onQualityChange(v / 100)}
            aria-label={`Quality: ${Math.round(quality * 100)}%`}
            className="py-4"
          />
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/60">
            <span className="flex items-center gap-1">Smallest size</span>
            <span className="flex items-center gap-1 text-right">Maximum detail</span>
          </div>
        </div>
      )}
    </div>
  );
}
