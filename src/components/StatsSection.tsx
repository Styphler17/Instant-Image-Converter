import { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "motion/react";
import { Zap, ShieldCheck, Layers, Infinity } from "lucide-react";

interface StatItemProps {
  label: string;
  value: number;
  suffix?: string;
  icon: any;
  description: string;
}

function StatItem({ label, value, suffix = "", icon: Icon, description }: StatItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const spring = useSpring(0, {
    mass: 1,
    stiffness: 100,
    damping: 30,
  });

  const displayValue = useTransform(spring, (current) => 
    Math.floor(current).toLocaleString() + suffix
  );

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return (
    <div ref={ref} className="flex flex-col items-center p-6 space-y-4 text-center group">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-500 scale-0 group-hover:scale-100" />
        <Icon className="h-10 w-10 text-primary relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
      </div>
      
      <div className="space-y-1">
        <motion.h3 className="text-4xl font-black tracking-tighter text-foreground tabular-nums">
          {displayValue}
        </motion.h3>
        <p className="text-xs font-black uppercase tracking-widest text-primary/80">{label}</p>
      </div>
      
      <p className="text-[11px] text-muted-foreground font-medium leading-relaxed max-w-[180px]">
        {description}
      </p>
    </div>
  );
}

export function StatsSection() {
  const stats = [
    {
      label: "Privacy Rating",
      value: 100,
      suffix: "%",
      icon: ShieldCheck,
      description: "Military-grade local encryption. No images ever touch our servers."
    },
    {
      label: "Format Support",
      value: 50,
      suffix: "+",
      icon: Layers,
      description: "From HEIC and RAW to PSD and AVIF. A truly universal toolkit."
    },
    {
      label: "Processing Speed",
      value: 10,
      suffix: "x",
      icon: Zap,
      description: "Local browser engine is 10x faster than traditional cloud uploads."
    },
    {
      label: "Batch Capacity",
      value: 1000,
      suffix: "+",
      icon: Infinity,
      description: "Process thousands of images in a single session with no daily caps."
    }
  ];

  return (
    <section className="py-20 border-y border-border/40 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 lg:divide-x divide-border/40">
          {stats.map((stat, i) => (
            <StatItem key={i} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
