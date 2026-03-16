import { useState, useEffect } from "react";
import { type OutputFormat, detectSupportedFormats } from "@/lib/image-converter";

/** Hook that detects which output formats the browser supports */
export function useCodecSupport() {
  const [supportedFormats, setSupportedFormats] = useState<OutputFormat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectSupportedFormats().then((formats) => {
      setSupportedFormats(formats);
      setLoading(false);
    });
  }, []);

  return { supportedFormats, loading };
}
