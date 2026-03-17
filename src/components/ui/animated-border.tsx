"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedBorderProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  borderWidth?: number;
  borderRadius?: number;
  color?: string;
}

export function AnimatedBorder({
  children,
  className,
  duration = 5,
  borderWidth = 2,
  borderRadius = 50,
  color,
}: AnimatedBorderProps) {
  return (
    <div 
      className={cn("relative group/animated-border", className)}
      style={{ borderRadius: `${borderRadius}px` }}
    >
      <div
        className={cn(
          "pointer-events-none absolute rounded-[inherit] border-transparent border-inset [mask-clip:padding-box,border-box]",
          "[mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
        )}
        style={{
          inset: `-${borderWidth}px`,
          borderWidth: `${borderWidth}px`,
          borderRadius: `${borderRadius}px`,
        }}
      >
        <motion.div
          className={cn(
            "absolute aspect-square bg-gradient-to-r from-transparent via-primary to-primary",
            color
          )}
          animate={{
            offsetDistance: ["0%", "100%"],
          }}
          style={{
            width: 40,
            offsetPath: `rect(0 auto auto 0 round ${borderRadius}px)`,
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: duration,
            ease: "linear",
          }}
        />
      </div>
      {children}
    </div>
  );
}
