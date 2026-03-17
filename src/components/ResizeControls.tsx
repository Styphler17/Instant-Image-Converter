import { type ResizeOptions, type ResizeMode } from "@/lib/image-converter";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Lock, Unlock, Maximize2, Monitor, Instagram, Share2, Printer, Globe, Zap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResizeControlsProps {
  resize: ResizeOptions;
  onChange: (resize: ResizeOptions) => void;
  originalWidth: number;
  originalHeight: number;
}

const PRESETS = [
  { group: "Social Media", items: [
    { label: "Instagram Post", width: 1080, height: 1080, icon: Instagram },
    { label: "Instagram Story", width: 1080, height: 1920, icon: Instagram },
    { label: "Facebook Cover", width: 820, height: 312, icon: Share2 },
    { label: "YouTube Thumbnail", width: 1280, height: 720, icon: Share2 },
    { label: "Twitter Header", width: 1500, height: 500, icon: Share2 },
  ]},
  { group: "Web & Apps", items: [
    { label: "Full HD (1080p)", width: 1920, height: 1080, icon: Monitor },
    { label: "HD (720p)", width: 1280, height: 720, icon: Monitor },
    { label: "OG Image (OpenGraph)", width: 1200, height: 630, icon: Globe },
    { label: "Favicon", width: 32, height: 32, icon: Globe },
  ]},
  { group: "Print (300 DPI approx)", items: [
    { label: "A4 Document", width: 2480, height: 3508, icon: Printer },
    { label: "A5 Document", width: 1748, height: 2480, icon: Printer },
    { label: "Business Card", width: 1050, height: 600, icon: Printer },
  ]}
];

export function ResizeControls({ resize, onChange, originalWidth, originalHeight }: ResizeControlsProps) {
  const aspectRatio = originalWidth / originalHeight;

  const isUpscaling = 
    (resize.mode === "percentage" && resize.percentage > 100) ||
    (resize.mode === "dimensions" && (resize.width > originalWidth || resize.height > originalHeight)) ||
    (resize.mode === "preset");

  const handleModeChange = (mode: ResizeMode) => {
    onChange({
      ...resize,
      mode,
      width: originalWidth,
      height: originalHeight,
      percentage: 100,
    });
  };

  const handlePresetSelect = (val: string) => {
    // Find preset by label
    for (const group of PRESETS) {
      const preset = group.items.find(item => item.label === val);
      if (preset) {
        onChange({
          ...resize,
          mode: "dimensions",
          width: preset.width,
          height: preset.height,
          lockAspectRatio: false, // Presets usually have fixed aspect ratios
        });
        break;
      }
    }
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
        <SelectTrigger className="w-full bg-background/50 border-border/60 h-11 focus:ring-primary/20 transition-all rounded-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="glass border-border/60 rounded-2xl">
          <SelectItem value="none" className="focus:bg-primary/10">Original Dimensions</SelectItem>
          <SelectItem value="percentage" className="focus:bg-primary/10">Scale by Percentage</SelectItem>
          <SelectItem value="dimensions" className="focus:bg-primary/10">Custom Pixel Size</SelectItem>
          <SelectItem value="preset" className="focus:bg-primary/10">Standard Presets</SelectItem>
        </SelectContent>
      </Select>

      {resize.mode === "preset" && (
        <div className="space-y-4 pt-2 animate-pop-in">
          <Select onValueChange={handlePresetSelect}>
            <SelectTrigger className="w-full bg-background/50 border-border/60 h-11 focus:ring-primary/20 transition-all rounded-full">
              <SelectValue placeholder="Choose a preset..." />
            </SelectTrigger>
            <SelectContent className="glass border-border/60 rounded-2xl max-h-80">
              {PRESETS.map((group) => (
                <SelectGroup key={group.group}>
                  <SelectLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1.5">
                    {group.group}
                  </SelectLabel>
                  {group.items.map((item) => (
                    <SelectItem key={item.label} value={item.label} className="focus:bg-primary/10">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-3.5 w-3.5 opacity-60" />
                        <span>{item.label}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto opacity-60">
                          {item.width}×{item.height}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          
          <div className="rounded-xl bg-muted/30 border border-border/40 p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Active Preset Dimensions</p>
            <p className="text-sm font-bold mt-1 tabular-nums">
              {resize.width} × {resize.height} <span className="text-[10px] text-muted-foreground">PX</span>
            </p>
          </div>
        </div>
      )}

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
                  className="bg-background/50 border-border/60 h-11 focus:ring-primary/20 pr-8 transition-all rounded-full"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40 pointer-events-none group-focus-within:text-primary/40 transition-colors">PX</span>
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
                  className="bg-background/50 border-border/60 h-11 focus:ring-primary/20 pr-8 transition-all rounded-full"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40 pointer-events-none group-focus-within:text-primary/40 transition-colors">PX</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isUpscaling && (
        <div className="pt-2 animate-in fade-in slide-in-from-top-1 duration-500">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="upscale-mode" className="text-xs font-bold block cursor-pointer">Smart AI Upscale</Label>
                <p className="text-[10px] text-muted-foreground font-medium">Bilinear smoothing & detail preservation</p>
              </div>
            </div>
            <Switch 
              id="upscale-mode" 
              checked={resize.upscale} 
              onCheckedChange={(v) => onChange({ ...resize, upscale: v })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
