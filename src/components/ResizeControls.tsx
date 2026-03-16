import { type ResizeOptions, type ResizeMode } from "@/lib/image-converter";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Maximize2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResizeControlsProps {
  resize: ResizeOptions;
  onChange: (resize: ResizeOptions) => void;
  originalWidth: number;
  originalHeight: number;
}

export function ResizeControls({ resize, onChange, originalWidth, originalHeight }: ResizeControlsProps) {
  const aspectRatio = originalWidth / originalHeight;

  const handleModeChange = (mode: ResizeMode) => {
    onChange({
      ...resize,
      mode,
      width: originalWidth,
      height: originalHeight,
      percentage: 100,
    });
  };

  const handleWidthChange = (w: number) => {
    const newResize = { ...resize, width: w };
    if (resize.lockAspectRatio) {
      newResize.height = Math.round(w / aspectRatio);
    }
    onChange(newResize);
  };

  const handleHeightChange = (h: number) => {
    const newResize = { ...resize, height: h };
    if (resize.lockAspectRatio) {
      newResize.width = Math.round(h * aspectRatio);
    }
    onChange(newResize);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Maximize2 className="h-4 w-4 text-primary" />
          </div>
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Image Scaling</Label>
        </div>
        {resize.mode !== "none" && (
           <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 animate-pop-in">MODIFIED</span>
        )}
      </div>

      <Select value={resize.mode} onValueChange={(v) => handleModeChange(v as ResizeMode)}>
        <SelectTrigger className="w-full bg-background/50 border-border/60 h-11 focus:ring-primary/20 transition-all">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="glass border-border/60">
          <SelectItem value="none" className="focus:bg-primary/10">Original Dimensions</SelectItem>
          <SelectItem value="percentage" className="focus:bg-primary/10">Scale by Percentage</SelectItem>
          <SelectItem value="dimensions" className="focus:bg-primary/10">Custom Pixel Size</SelectItem>
        </SelectContent>
      </Select>

      {resize.mode === "percentage" && (
        <div className="space-y-4 pt-2 animate-pop-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">Target Scale</span>
            <div className="px-2 py-1 rounded-md bg-background border border-border/60 text-sm font-bold tabular-nums text-primary shadow-sm">
              {resize.percentage}%
            </div>
          </div>
          <Slider
            min={10}
            max={200}
            step={5}
            value={[resize.percentage]}
            onValueChange={([v]) => onChange({ ...resize, percentage: v })}
            aria-label={`Scale: ${resize.percentage}%`}
            className="py-2"
          />
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/60">
            <span>10%</span>
            <span>200%</span>
          </div>
          <div className="rounded-xl bg-muted/30 border border-border/40 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Resulting Size</p>
            <p className="text-sm font-bold mt-1 tabular-nums">
              {Math.round(originalWidth * resize.percentage / 100)} × {Math.round(originalHeight * resize.percentage / 100)} <span className="text-[10px] text-muted-foreground">PX</span>
            </p>
          </div>
        </div>
      )}

      {resize.mode === "dimensions" && (
        <div className="space-y-4 pt-2 animate-pop-in">
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="resize-w" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Width</Label>
              <div className="relative group">
                <Input
                  id="resize-w"
                  type="number"
                  min={1}
                  max={16384}
                  value={resize.width || ""}
                  onChange={(e) => handleWidthChange(Number(e.target.value) || 1)}
                  className="bg-background/50 border-border/60 h-11 focus:ring-primary/20 pr-8 transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40 pointer-events-none group-focus-within:text-primary/40 transition-colors">PX</span>
              </div>
            </div>

            <div className="flex flex-col items-center pt-6">
               <div className="h-px w-4 bg-border/60" />
               <Button
                 variant="ghost"
                 size="icon"
                 className={`h-9 w-9 rounded-full transition-all duration-300 ${resize.lockAspectRatio ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
                 onClick={() => onChange({ ...resize, lockAspectRatio: !resize.lockAspectRatio })}
                 aria-label={resize.lockAspectRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
               >
                 {resize.lockAspectRatio ? (
                   <Lock className="h-4 w-4" />
                 ) : (
                   <Unlock className="h-4 w-4 opacity-50" />
                 )}
               </Button>
               <div className="h-px w-4 bg-border/60" />
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="resize-h" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Height</Label>
              <div className="relative group">
                <Input
                  id="resize-h"
                  type="number"
                  min={1}
                  max={16384}
                  value={resize.height || ""}
                  onChange={(e) => handleHeightChange(Number(e.target.value) || 1)}
                  className="bg-background/50 border-border/60 h-11 focus:ring-primary/20 pr-8 transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40 pointer-events-none group-focus-within:text-primary/40 transition-colors">PX</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
