import { Shield, Zap, Infinity, Lock, Smartphone, Heart } from "lucide-react";

const features = [
  {
    title: "100% Private",
    description: "Your images never leave your device. All processing happens locally in your browser.",
    icon: Shield,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    title: "No Limits",
    description: "Convert unlimited files in one batch. No daily caps, no hidden fees, and no file size restrictions.",
    icon: Infinity,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Instant Speed",
    description: "Bypass server queues. Local processing is up to 10x faster than cloud-based alternatives.",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    title: "No Accounts",
    description: "No signups, no emails, and absolutely no ads. Just open and convert instantly.",
    icon: Lock,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "PWA Ready",
    description: "Install as an app on your phone or desktop for offline access and native experience.",
    icon: Smartphone,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Free Forever",
    description: "Professional tools without the price tag. Supported by voluntary donations only.",
    icon: Heart,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
];

export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12 border-t border-border/40">
      {features.map((feature, i) => (
        <div key={i} className="glass-card rounded-2xl p-6 space-y-4 hover:scale-[1.02] transition-transform duration-300">
          <div className={`h-12 w-12 rounded-xl ${feature.bg} flex items-center justify-center`}>
            <feature.icon className={`h-6 w-6 ${feature.color}`} />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-base">{feature.title}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground font-medium">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
