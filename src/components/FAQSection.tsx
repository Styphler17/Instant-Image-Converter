import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Is this image converter really free?",
    a: "Yes, **100% free forever**—no ads, no signups, no limits. Unlike FreeConvert (10 files/day) or Online-Convert (ads everywhere), convert unlimited batches instantly."
  },
  {
    q: "Does this image converter upload my files anywhere?",
    a: "**No uploads ever**—100% client-side JavaScript. Your photos stay in your browser (unlike server-based tools flagged for malware). Perfect for logos, private photos."
  },
  {
    q: "What image formats can I convert?",
    a: "Convert **JPG, PNG, WebP, GIF, SVG** + preview HEIC/HEIF. Output to JPG (lossy), PNG (transparent), WebP (smallest), or PDF. More formats than Canva/Adobe free tiers."
  },
  {
    q: "Can I convert multiple images at once?",
    a: "**Unlimited batch conversion**—drag 100+ images, set quality/resize once, download all. Beats Img2Go (10 files max), iLoveIMG (50 to JPG only)."
  },
  {
    q: "How do I convert HEIC to JPG or WebP?",
    a: "Drag iPhone HEIC files—tool previews instantly, converts to JPG/WebP with quality slider (10–100%). No app downloads like iMazing required."
  },
  {
    q: "Will my images lose quality when converting?",
    a: "Control **quality precisely** (10–100% slider) + auto-resize. WebP output 30–50% smaller than JPG at same quality. Strip EXIF for privacy."
  },
  {
    q: "Is it safe to use for professional work?",
    a: "**Zero privacy risk**—no servers touched. GDPR‑safe for client logos/watermarks. 2026 reviews show server converters (FreeConvert) flagged for data leaks."
  },
  {
    q: "Why is this faster than other converters?",
    a: "**Client-side processing** = instant (under 1s/image). No server queues like Img2Go or CloudConvert 'conversion minutes'."
  },
  {
    q: "Can I use it on mobile?",
    a: "**Yes, full touch support**—PWA‑ready. Works offline after first load. Better than desktop‑only tools like iMazing."
  },
  {
    q: "What's the file size limit?",
    a: "**Browser max only** (~2GB practical). No 100MB caps like competitors. Perfect for bulk site images or social media batches."
  },
  {
    q: "Do I need an account to use it?",
    a: "**No accounts ever**—unlike Canva/Adobe requiring login for batch. Just drag, convert, download."
  },
  {
    q: "Can I resize and compress images too?",
    a: "**Yes, all‑in‑one**: Resize (pixel/%), compress (quality slider), format convert. One tool replaces 3 steps vs. separate resizers."
  }
];

export function FAQSection() {
  // Generate JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a.replace(/\*\*/g, "")
      }
    }))
  };

  return (
    <section id="faq" className="pt-20 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col items-center gap-4 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-widest text-primary">
          <HelpCircle className="h-3 w-3" />
          Everything you need to know
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-gradient">Frequently Asked Questions</h2>
        <p className="text-muted-foreground font-medium max-w-lg">Transparent answers about privacy, speed, and limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 max-w-5xl mx-auto px-4">
        {faqs.map((faq, i) => (
          <div key={i} className="space-y-3 group">
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
              {faq.q}
            </h3>
            <p 
              className="text-sm text-muted-foreground leading-relaxed font-medium"
              dangerouslySetInnerHTML={{ 
                __html: faq.a
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-bold">$1</strong>')
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
