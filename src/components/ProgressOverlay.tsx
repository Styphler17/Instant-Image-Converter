import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

interface ProgressOverlayProps {
  visible: boolean;
  message?: string;
}

export function ProgressOverlay({ visible, message = "Processing Images..." }: ProgressOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center"
        >
          {/* Background Dimming */}
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />

          {/* Radiation Waves */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-primary rounded-full animate-radiation" style={{ animationDelay: '0s' }} />
            <div className="absolute w-1 h-1 bg-primary rounded-full animate-radiation" style={{ animationDelay: '0.5s' }} />
            <div className="absolute w-1 h-1 bg-primary rounded-full animate-radiation" style={{ animationDelay: '1s' }} />
            <div className="absolute w-1 h-1 bg-primary rounded-full animate-radiation" style={{ animationDelay: '1.5s' }} />
          </div>

          {/* Floating Processing Badge */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10 bg-primary/90 backdrop-blur-md text-primary-foreground px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20"
          >
            <div className="relative">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <div className="absolute inset-0 blur-lg bg-white/50 animate-pulse" />
            </div>
            <span className="text-sm font-black uppercase tracking-widest">{message}</span>
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </motion.div>

          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-20 w-full animate-scanline pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
