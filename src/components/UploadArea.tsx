import { useRef, useState, useCallback } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { ACCEPTED_INPUT_TYPES } from "@/lib/image-converter";

interface UploadAreaProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
}

export function UploadArea({ onFiles, multiple = true }: UploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
      if (files.length) onFiles(multiple ? files : [files[0]]);
    },
    [onFiles, multiple]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length) onFiles(multiple ? files : [files[0]]);
      // Reset input so re-selecting same file triggers change
      if (inputRef.current) inputRef.current.value = "";
    },
    [onFiles, multiple]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload image files"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={`
        group relative flex cursor-pointer flex-col items-center justify-center gap-6 
        rounded-2xl border-2 border-dashed p-10 sm:p-16 transition-all duration-300
        ${dragActive
          ? "border-primary bg-primary/10 scale-[0.99] shadow-inner"
          : "glass border-border/60 hover:border-primary/40 hover:bg-muted/30 hover:shadow-lg"
        }
      `}
    >
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className={`
          relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 
          transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/20 group-hover:rotate-3
          ${dragActive ? "scale-90 rotate-0" : ""}
        `}>
          {dragActive ? (
            <Upload className="h-10 w-10 text-primary animate-bounce" />
          ) : (
            <ImageIcon className="h-10 w-10 text-primary transition-transform group-hover:scale-110" />
          )}
        </div>
      </div>

      <div className="text-center relative z-10">
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {dragActive ? "Release to start" : "Drop images here"}
        </h3>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          or <span className="text-primary underline-offset-4 group-hover:underline">browse files</span> on your device
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
           {['JPG', 'PNG', 'WebP', 'AVIF'].map(fmt => (
             <span key={fmt} className="px-2 py-1 rounded-md bg-muted text-[10px] font-bold tracking-wider">{fmt}</span>
           ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
           Maximum quality · 30MB limit
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_INPUT_TYPES}
        onChange={handleChange}
        className="sr-only"
        aria-hidden="true"
        multiple={multiple}
      />
    </div>
  );
}
