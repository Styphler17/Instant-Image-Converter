import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { type EnhancementOptions, type WatermarkOptions } from "@/lib/image-converter";
import { Sliders, Droplet, Shield, Edit3 } from "lucide-react";

interface AdvancedOptionsProps {
  enhancements: EnhancementOptions;
  setEnhancements: (e: EnhancementOptions) => void;
  watermark: WatermarkOptions;
  setWatermark: (w: WatermarkOptions) => void;
  removeExif: boolean;
  setRemoveExif: (r: boolean) => void;
  batchPrefix: string;
  setBatchPrefix: (p: string) => void;
}

export function AdvancedOptions({
  enhancements,
  setEnhancements,
  watermark,
  setWatermark,
  removeExif,
  setRemoveExif,
  batchPrefix,
  setBatchPrefix,
}: AdvancedOptionsProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {/* Enhancements */}
      <AccordionItem value="enhancements" className="border border-border/40 rounded-xl px-4 bg-background/50">
        <AccordionTrigger className="hover:no-underline py-3">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
            <Sliders className="h-4 w-4 text-primary" />
            Photo Enhancements
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2 pb-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground">
              <Label>Brightness</Label>
              <span>{enhancements.brightness}%</span>
            </div>
            <Slider
              min={0} max={200} step={1}
              value={[enhancements.brightness]}
              onValueChange={([v]) => setEnhancements({ ...enhancements, brightness: v })}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground">
              <Label>Contrast</Label>
              <span>{enhancements.contrast}%</span>
            </div>
            <Slider
              min={0} max={200} step={1}
              value={[enhancements.contrast]}
              onValueChange={([v]) => setEnhancements({ ...enhancements, contrast: v })}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground">
              <Label>Saturation</Label>
              <span>{enhancements.saturation}%</span>
            </div>
            <Slider
              min={0} max={200} step={1}
              value={[enhancements.saturation]}
              onValueChange={([v]) => setEnhancements({ ...enhancements, saturation: v })}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Watermark */}
      <AccordionItem value="watermark" className="border border-border/40 rounded-xl px-4 bg-background/50">
        <AccordionTrigger className="hover:no-underline py-3">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
            <Droplet className="h-4 w-4 text-blue-500" />
            Watermark
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2 pb-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground">Enable Watermark</Label>
            <Switch
              checked={watermark.enabled}
              onCheckedChange={(v) => setWatermark({ ...watermark, enabled: v })}
            />
          </div>
          {watermark.enabled && (
            <div className="space-y-4 animate-pop-in">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">Text</Label>
                <Input
                  value={watermark.text}
                  onChange={(e) => setWatermark({ ...watermark, text: e.target.value })}
                  placeholder="e.g. © 2024 MyBrand"
                  className="h-9 text-sm bg-card"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">Position</Label>
                <Select
                  value={watermark.position}
                  onValueChange={(v: any) => setWatermark({ ...watermark, position: v })}
                >
                  <SelectTrigger className="h-9 bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Batch & Privacy */}
      <AccordionItem value="batch" className="border border-border/40 rounded-xl px-4 bg-background/50">
        <AccordionTrigger className="hover:no-underline py-3">
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
            <Edit3 className="h-4 w-4 text-purple-500" />
            Batch & Privacy
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pt-2 pb-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground">Batch Name Prefix</Label>
            <Input
              value={batchPrefix}
              onChange={(e) => setBatchPrefix(e.target.value)}
              placeholder="e.g. Website_Asset"
              className="h-9 text-sm bg-card"
            />
            <p className="text-[10px] text-muted-foreground/60">Results in: Website_Asset_image.png</p>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-card shadow-sm">
            <div className="space-y-1">
              <Label className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <Shield className="h-3 w-3 text-success" />
                Privacy Shield (EXIF Strip)
              </Label>
              <p className="text-[10px] text-muted-foreground">Remove GPS and camera data</p>
            </div>
            <Switch
              checked={removeExif}
              onCheckedChange={setRemoveExif}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}