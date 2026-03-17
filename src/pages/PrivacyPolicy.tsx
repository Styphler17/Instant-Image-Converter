import { AppShell } from "@/components/AppShell";
import { ShieldCheck, Lock, EyeOff, Server } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <AppShell>
      <div className="container max-w-4xl py-12 sm:py-20 animate-pop-in">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary">
              <ShieldCheck className="h-3 w-3" />
              Privacy First
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Privacy Policy</h1>
            <p className="text-muted-foreground font-medium">Last updated: March 17, 2026</p>
          </div>

          <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-10 leading-relaxed">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Server className="h-5 w-5" />
                <h2 className="text-xl font-bold">100% Local Processing</h2>
              </div>
              <p className="text-muted-foreground">
                The core principle of Instant Image Converter is that **your data never leaves your device**. Unlike traditional online converters, we do not upload your images to any server. All conversion, resizing, and enhancement logic happens directly in your browser using modern web technologies like WebAssembly and Canvas API.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Lock className="h-5 w-5" />
                <h2 className="text-xl font-bold">No Data Collection</h2>
              </div>
              <p className="text-muted-foreground">
                We do not collect, store, or share any personal information. We do not track your conversion history, your original filenames, or the content of your images. Since there are no accounts required, we have no database of user information.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <EyeOff className="h-5 w-5" />
                <h2 className="text-xl font-bold">Cookies and Analytics</h2>
              </div>
              <p className="text-muted-foreground">
                We use minimal, privacy-respecting analytics to understand general usage patterns (like which formats are most popular) to improve the tool. This data is aggregated and anonymized. We do not use tracking cookies for advertising purposes.
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-border/40">
              <h2 className="text-xl font-bold text-foreground">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this privacy policy or our local processing technology, please contact us at <a href="mailto:privacy@creativeutil.com" className="text-primary hover:underline">privacy@creativeutil.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default PrivacyPolicy;
