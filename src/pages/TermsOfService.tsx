import { AppShell } from "@/components/AppShell";
import { Scale, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";

const TermsOfService = () => {
  return (
    <AppShell>
      <div className="container max-w-4xl py-12 sm:py-20 animate-pop-in">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary">
              <Scale className="h-3 w-3" />
              Legal Agreement
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Terms of Service</h1>
            <p className="text-muted-foreground font-medium">Last updated: March 17, 2026</p>
          </div>

          <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-10 leading-relaxed">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <FileText className="h-5 w-5" />
                <h2 className="text-xl font-bold">Agreement to Terms</h2>
              </div>
              <p className="text-muted-foreground">
                By accessing or using Instant Image Converter, you agree to be bound by these Terms of Service. This tool is provided "as is" for the purpose of image conversion and optimization directly within your web browser.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <CheckCircle2 className="h-5 w-5" />
                <h2 className="text-xl font-bold">Permitted Use</h2>
              </div>
              <p className="text-muted-foreground">
                You may use this tool for both personal and commercial projects. Since the processing is done locally on your machine, you are responsible for ensuring you have the necessary rights to the images you process. We do not impose any limits on the number of files you can convert.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="text-xl font-bold">Disclaimer of Warranties</h2>
              </div>
              <p className="text-muted-foreground">
                Instant Image Converter is provided without any warranties, express or implied. We do not guarantee that the tool will be error-free or that the converted images will meet your specific quality requirements. We are not liable for any data loss or damage resulting from the use of this software.
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-border/40">
              <h2 className="text-xl font-bold text-foreground">Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Your continued use of the tool after such changes constitutes your acceptance of the new Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default TermsOfService;
