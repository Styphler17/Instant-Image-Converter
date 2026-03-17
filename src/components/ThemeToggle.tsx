"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBorder } from "./ui/animated-border";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 glass border-border/40 rounded-[50px] h-10 w-[112px]">
        <div className="h-8 w-8 rounded-full flex items-center justify-center opacity-20"><Monitor className="h-4 w-4" /></div>
        <div className="h-8 w-8 rounded-full flex items-center justify-center opacity-20"><Sun className="h-4 w-4" /></div>
        <div className="h-8 w-8 rounded-full flex items-center justify-center opacity-20"><Moon className="h-4 w-4" /></div>
      </div>
    );
  }

  const themes = [
    { id: "system", icon: Monitor, label: "System" },
    { id: "light", icon: Sun, label: "Light" },
    { id: "dark", icon: Moon, label: "Dark" },
  ];

  return (
    <AnimatedBorder borderRadius={50} className="p-[1px]">
      <div className="flex items-center gap-0.5 p-1 glass border-none rounded-[50px] shadow-sm h-10 transition-all duration-300">
        {themes.map((t) => {
          const Icon = t.icon;
          const isActive = theme === t.id;
          return (
            <Button
              key={t.id}
              variant="ghost"
              size="icon"
              onClick={() => setTheme(t.id)}
              className={cn(
                "h-8 w-8 rounded-full transition-all duration-200 relative",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm scale-100" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary scale-90 opacity-60 hover:opacity-100"
              )}
              title={`${t.label} mode`}
            >
              <Icon className="h-4 w-4 z-10" />
              {isActive && (
                <div className="absolute inset-0 bg-primary rounded-full -z-0 animate-in fade-in zoom-in duration-300" />
              )}
              <span className="sr-only">{t.label} theme</span>
            </Button>
          );
        })}
      </div>
    </AnimatedBorder>
  );
}
