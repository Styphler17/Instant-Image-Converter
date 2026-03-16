import { ReactNode } from "react";
import { usePWAInstallPrompt } from "@/hooks/usePWAInstallPrompt";
import { Download, X, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { showBanner, isIOS, promptInstall, dismiss } = usePWAInstallPrompt();

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      {/* Install banner */}
      {showBanner && (
        <div className="flex items-center justify-between gap-3 bg-primary/90 backdrop-blur-md px-4 py-2 text-primary-foreground text-sm sticky top-0 z-50 shadow-sm transition-all duration-300">
          {isIOS ? (
            <span className="flex items-center gap-2 font-medium">
              <Share className="h-4 w-4 shrink-0 opacity-90" />
              To install, tap Share → Add to Home Screen
            </span>
          ) : (
            <span className="flex items-center gap-2 font-medium">
              <Download className="h-4 w-4 shrink-0 opacity-90" />
              Install for instant access
            </span>
          )}
          <div className="flex items-center gap-2">
            {!isIOS && (
              <Button
                variant="secondary"
                size="sm"
                onClick={promptInstall}
                className="h-7 text-xs font-bold px-3 shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                Install
              </Button>
            )}
            <button
              onClick={dismiss}
              className="rounded-full p-1 hover:bg-white/20 transition-all active:scale-90"
              aria-label="Dismiss install prompt"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 w-full glass border-b border-border/40 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/50 to-blue-500/50 opacity-0 blur group-hover:opacity-100 transition duration-500"></div>
              <img src="/icons/icon-192.png" alt="" className="relative h-9 w-9 rounded-lg shadow-sm" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight leading-none text-foreground">
                <span className="text-gradient">Instant Image Converter</span>
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80 hidden sm:block mt-1">
                Private · Browser-based · High Speed
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Placeholder for theme toggle or extra actions if needed */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[20%] left-[10%] w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm px-4 py-8 text-center">
        <div className="container max-w-lg space-y-4">
          <p className="text-sm font-medium text-foreground/80">
            100% Private & Secure
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your images never leave your device. All processing happens locally in your browser using the Canvas API. No data is sent to any server.
          </p>
          <div className="flex justify-center gap-4 pt-2">
             <div className="h-1 w-1 rounded-full bg-border" />
             <div className="h-1 w-1 rounded-full bg-border" />
             <div className="h-1 w-1 rounded-full bg-border" />
          </div>
        </div>
      </footer>
    </div>
  );
}
