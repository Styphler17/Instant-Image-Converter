import { ReactNode, useEffect, useState } from "react";
import { usePWAInstallPrompt } from "@/hooks/usePWAInstallPrompt";
import { Download, X, Share, Coffee, Heart, CreditCard, Cloud, ExternalLink, Sparkles, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { showBanner, isIOS, promptInstall, dismiss } = usePWAInstallPrompt();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
                className="h-7 text-xs font-bold px-3 shadow-sm hover:shadow-md active:scale-95 transition-all rounded-full"
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
            <ThemeToggle />
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

      {/* Back to top button */}
      <Button
        variant="secondary"
        size="icon"
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 rounded-full h-12 w-12 shadow-lg transition-all duration-300 glass border-border/40 ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-6 w-6" />
      </Button>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm px-4 py-16 text-center">
        <div className="container max-w-2xl space-y-12">
          {/* Affiliate Section */}
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-600">
                <Sparkles className="h-3 w-3" />
                Next Steps
              </div>
              <h4 className="text-responsive-h2 font-bold tracking-tight">Enhance your workflow</h4>
              <p className="text-xs text-muted-foreground">Store your converted images securely in the cloud</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <a 
                href="https://www.dropbox.com/referrals/AAAKDAHnxdbluJHNHH6Fiy1d6jeHmtSmEXg?src=global9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl glass-card text-left hover:border-primary/40 transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-[#1E88E5]/10 flex items-center justify-center shrink-0">
                  <svg className="h-6 w-6 transition-transform group-hover:scale-110" viewBox="0 0 48 48">
                    <path fill="#1E88E5" d="M42 13.976L31.377 7.255 24 13.314 35.026 19.732zM6 25.647L16.933 32.055 24 26.633 13.528 19.969zM16.933 7.255L6 14.301 13.528 19.969 24 13.314zM24 26.633L31.209 32.055 42 25.647 35.026 19.732z"></path>
                    <path fill="#1E88E5" d="M32.195 33.779L31.047 34.462 29.979 33.658 24 29.162 18.155 33.646 17.091 34.464 15.933 33.785 13 32.066 13 34.738 23.988 42 35 34.794 35 32.114z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold flex items-center gap-1.5">
                    Dropbox
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Best for teams</p>
                </div>
              </a>

              <a 
                href="https://e.pcloud.com/#/register?invite=WHU2ZtSuKXy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl glass-card text-left hover:border-primary/40 transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-[#00bcd4]/10 flex items-center justify-center shrink-0">
                  <svg className="h-6 w-6 transition-transform group-hover:scale-110" viewBox="0 0 48 48">
                    <path fill="#00bcd4" d="M9,24c0,0-0.258-0.961-0.258-2.289c0-1.593,0.331-3.964,1.258-5.601C4.36,16.847,0,21.658,0,27.5 C0,33.851,5.149,39,11.5,39S40,39,40,39V24H9z"></path>
                    <path fill="#00bcd4" d="M24 9A15 15 0 1 0 24 39A15 15 0 1 0 24 9Z"></path>
                    <path fill="#fff" d="M24,36c-6.617,0-12-5.383-12-12s5.383-12,12-12s12,5.383,12,12S30.617,36,24,36z M24,14 c-5.514,0-10,4.486-10,10s4.486,10,10,10s10-4.486,10-10S29.514,14,24,14z"></path>
                    <path fill="#fff" d="M20.5,31c-0.829,0-1.5-0.672-1.5-1.5v-10c0-0.828,0.671-1.5,1.5-1.5h5c2.481,0,4.5,2.019,4.5,4.5 S27.981,27,25.5,27H22v2.5C22,30.328,21.329,31,20.5,31z M22,24h3.5c0.827,0,1.5-0.673,1.5-1.5S26.327,21,25.5,21H22V24z"></path>
                    <path fill="#00bcd4" d="M45,22.5c0-3.59-2.91-6.5-6.5-6.5c-0.211,0-0.294-0.02-0.5,0c0.028,0.053-0.002-0.003,0,0 c0.929,1.637,1.258,4.117,1.258,5.711C39.258,23.039,39,24,39,24v4.975C42.355,28.719,45,25.921,45,22.5z"></path>
                    <path fill="#00bcd4" d="M45.551,25.25C44.665,27.165,42.544,28,41.962,28C40.919,28,39,28,39,28v11c0.317-0.023,0.646,0,1,0 c4.418,0,8-3.582,8-8C48,28.74,47.059,26.703,45.551,25.25z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold flex items-center gap-1.5">
                    pCloud
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Lifetime Storage</p>
                </div>
              </a>
            </div>
          </div>

          <div className="h-px w-24 bg-border/40 mx-auto" />

          {/* Support Section */}
          <div className="flex flex-col items-center gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary">
                <Heart className="h-3 w-3" />
                Support the Project
              </div>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                This tool is 100% free and private. Consider supporting its maintenance.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all px-6 py-5 group bg-background/50 backdrop-blur-sm"
                asChild
              >
                <a href="https://buymeacoffee.com/stiffler17" target="_blank" rel="noopener noreferrer">
                  <Coffee className="h-4 w-4 text-[#FFDD00] group-hover:rotate-12 transition-transform" />
                  <span className="font-bold">Buy me a coffee</span>
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 rounded-full border-blue-600/20 hover:bg-blue-600/5 hover:border-blue-600/40 transition-all px-6 py-5 group bg-background/50 backdrop-blur-sm"
                asChild
              >
                <a href="https://paypal.me/BraStyphler17" target="_blank" rel="noopener noreferrer">
                  <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 48 48">
                    <path fill="#1565C0" d="M18.7,13.767l0.005,0.002C18.809,13.326,19.187,13,19.66,13h13.472c0.017,0,0.034-0.007,0.051-0.006C32.896,8.215,28.887,6,25.35,6H11.878c-0.474,0-0.852,0.335-0.955,0.777l-0.005-0.002L5.029,33.813l0.013,0.001c-0.014,0.064-0.039,0.125-0.039,0.194c0,0.553,0.447,0.991,1,0.991h8.071L18.7,13.767z"></path>
                    <path fill="#039BE5" d="M33.183,12.994c0.053,0.876-0.005,1.829-0.229,2.882c-1.281,5.995-5.912,9.115-11.635,9.115c0,0-3.47,0-4.313,0c-0.521,0-0.767,0.306-0.88,0.54l-1.74,8.049l-0.305,1.429h-0.006l-1.263,5.796l0.013,0.001c-0.014,0.064-0.039,0.125-0.039,0.194c0,0.553,0.447,1,1,1h7.333l0.013-0.01c0.472-0.007,0.847-0.344,0.945-0.788l0.018-0.015l1.812-8.416c0,0,0.126-0.803,0.97-0.803s4.178,0,4.178,0c5.723,0,10.401-3.106,11.683-9.102C42.18,16.106,37.358,13.019,33.183,12.994z"></path>
                    <path fill="#283593" d="M19.66,13c-0.474,0-0.852,0.326-0.955,0.769L18.7,13.767l-2.575,11.765c0.113-0.234,0.359-0.54,0.88-0.54c0.844,0,4.235,0,4.235,0c5.723,0,10.432-3.12,11.713-9.115c0.225-1.053,0.282-2.006,0.229-2.882C33.166,12.993,33.148,13,33.132,13H19.66z"></path>
                  </svg>
                  <span className="font-bold">PayPal</span>
                </a>
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-border/20">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              100% Private · No Server Uploads
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed italic opacity-80">
              Your data safety is our priority. All processing happens locally in your browser.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
