import { type OutputFormat, formatName } from "@/lib/image-converter";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
];

const LOSSY_FORMATS: OutputFormat[] = ["image/jpeg", "image/webp", "image/avif"];

export function FormatSelector({
  outputFormat,
  onFormatChange,
  quality,
  onQualityChange,
  supportedFormats,
}: FormatSelectorProps) {
  const isLossy = LOSSY_FORMATS.includes(outputFormat);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="format-select" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Target Format
          </Label>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">RECOMMENDED</span>
        </div>
        <Select
          value={outputFormat}
          onValueChange={(v) => onFormatChange(v as OutputFormat)}
        >
          <SelectTrigger id="format-select" className="w-full bg-background/50 border-border/60 focus:ring-primary/20 transition-all h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass border-border/60">
            {ALL_FORMATS.map(({ value, label }) => {
              const supported = supportedFormats.includes(value);
              return supported ? (
                <SelectItem key={value} value={value} className="focus:bg-primary/10 focus:text-primary transition-colors">
                  {label}
                </SelectItem>
              ) : (
                <div key={value} className="flex items-center px-2 py-1.5 text-xs text-muted-foreground cursor-not-allowed opacity-40 italic">
                  {label} (Unsupported)
                </div>
              );
            })}
          </SelectContent>
        </Select>
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
