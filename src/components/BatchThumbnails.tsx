import { type BatchItem } from "@/hooks/useImageConversion";
import { formatBytes } from "@/lib/image-converter";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BatchThumbnailsProps {
  items: BatchItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function BatchThumbnails({ items, activeIndex, onSelect }: BatchThumbnailsProps) {
  if (items.length <= 1) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Current Batch · {items.length} Files
        </p>
        <div className="flex gap-1">
           {items.map((_, i) => (
             <div key={i} className={cn("h-1 w-1 rounded-full transition-all duration-300", i === activeIndex ? "w-3 bg-primary" : "bg-border")} />
           ))}
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onSelect(i)}
            className={cn(
              "relative flex-shrink-0 group transition-all duration-300",
              i === activeIndex ? "scale-105" : "hover:scale-105"
            )}
          >
            <div className={cn(
              "h-16 w-16 rounded-xl border-2 overflow-hidden shadow-sm transition-all duration-300",
              i === activeIndex
                ? "border-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10"
                : "border-border/60 hover:border-primary/40 group-hover:shadow-md"
            )}>
              {item.imageInfo.url ? (
                <img
                  src={item.imageInfo.url}
                  alt={item.imageInfo.file.name}
                  className={cn("h-full w-full object-cover transition-transform duration-500", i === activeIndex ? "scale-110" : "group-hover:scale-110")}
                />
              ) : (
                <div className="h-full w-full bg-muted/50 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </div>
              )}
            </div>

            {/* Status indicator */}
            <div className="absolute -top-1 -right-1">
              {item.state === "done" && (
                <div className="bg-background rounded-full p-0.5 shadow-sm border border-success/20">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                </div>
              )}
              {item.state === "converting" && (
                <div className="bg-background rounded-full p-0.5 shadow-sm border border-primary/20">
                  <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                </div>
              )}
              {item.state === "error" && (
                <div className="bg-background rounded-full p-0.5 shadow-sm border border-destructive/20">
                  <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                </div>
              )}
            </div>
            
            {i === activeIndex && (
               <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-4 bg-primary rounded-full animate-pop-in" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
