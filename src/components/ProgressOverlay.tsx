import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProgressOverlayProps {
  visible: boolean;
  message?: string;
}

export function ProgressOverlay({ visible, message = "Converting…" }: ProgressOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="alert"
      aria-live="assertive"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-4 rounded-lg bg-card p-8 shadow-lg border border-border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-foreground">{message}</p>
        <Progress value={undefined} className="w-48" />
      </div>
    </div>
  );
}
