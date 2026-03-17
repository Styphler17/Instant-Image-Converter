import { useRef, useState, useCallback, useEffect } from "react";
import { Upload, Image as ImageIcon, FolderOpen, FileUp } from "lucide-react";
import { ACCEPTED_INPUT_TYPES } from "@/lib/image-converter";
import { Button } from "./ui/button";

interface UploadAreaProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
}

export function UploadArea({ onFiles, multiple = true }: UploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Helper to recursively get files from a directory entry
  const getFilesFromEntry = async (entry: any): Promise<File[]> => {
    if (entry.isFile) {
      return new Promise((resolve) => {
        entry.file((file: File) => {
          if (file.type.startsWith("image/") || ACCEPTED_INPUT_TYPES.split(",").some(ext => file.name.toLowerCase().endsWith(ext.trim().replace("*.", "")))) {
            resolve([file]);
          } else {
            resolve([]);
          }
        });
      });
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const entries = await new Promise<any[]>((resolve) => {
        reader.readEntries(resolve);
      });
      const files = await Promise.all(entries.map(getFilesFromEntry));
      return files.flat();
    }
    return [];
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);

      const items = Array.from(e.dataTransfer.items);
      if (items.length > 0) {
        const filePromises = items.map((item) => {
          const entry = item.webkitGetAsEntry();
          return entry ? getFilesFromEntry(entry) : [];
        });

        const allFiles = (await Promise.all(filePromises)).flat();
        if (allFiles.length) {
          onFiles(multiple ? allFiles : [allFiles[0]]);
        }
      }
    },
    [onFiles, multiple]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      const imageFiles = selectedFiles.filter(f => f.type.startsWith("image/") || true); // Trust the input accept filter mostly
      if (imageFiles.length) onFiles(multiple ? imageFiles : [imageFiles[0]]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [onFiles, multiple]
  );

  // Set webkitdirectory for folder input
  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute("webkitdirectory", "");
      folderInputRef.current.setAttribute("directory", "");
    }
  }, []);

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload image files or folders"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={(e) => {
          // Only trigger if clicking the area directly, not buttons
          if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drop-text')) {
             fileInputRef.current?.click();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`
          group relative flex cursor-pointer flex-col items-center justify-center gap-6 
          rounded-[50px] border-2 border-dashed p-10 sm:p-16 transition-all duration-500
          ${dragActive
            ? "border-primary bg-primary/10 scale-[0.98] shadow-2xl"
            : "glass border-border/40 hover:border-primary/40 hover:bg-muted/30 hover:shadow-xl"
          }
        `}
      >
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className={`
            relative flex h-24 w-24 items-center justify-center rounded-[32px] bg-primary/10 
            transition-all duration-700 group-hover:scale-110 group-hover:bg-primary/20 group-hover:rotate-6
            ${dragActive ? "scale-90 rotate-0" : ""}
          `}>
            {dragActive ? (
              <Upload className="h-12 w-12 text-primary animate-bounce" />
            ) : (
              <ImageIcon className="h-12 w-12 text-primary transition-transform group-hover:scale-110" />
            )}
          </div>
        </div>

        <div className="text-center relative z-10 drop-text">
          <h3 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {dragActive ? "Release to start" : "Drop your workspace"}
          </h3>
          <p className="mt-3 text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">
            Files or entire folders
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 relative z-10">
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="rounded-full gap-2 font-bold px-8 shadow-md hover:shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <FileUp className="h-4 w-4" />
            Select Files
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={(e) => {
              e.stopPropagation();
              folderInputRef.current?.click();
            }}
            className="rounded-full gap-2 font-bold px-8 border-border/60 glass hover:bg-muted/50 transition-all hover:scale-105 active:scale-95"
          >
            <FolderOpen className="h-4 w-4" />
            Upload Folder
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2 opacity-40 group-hover:opacity-80 transition-opacity duration-500">
           {['HEIC', 'WEBP', 'AVIF', 'PNG', 'JPG'].map(fmt => (
             <span key={fmt} className="px-3 py-1 rounded-full bg-muted text-[10px] font-black tracking-widest">{fmt}</span>
           ))}
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">
             Privacy First · Zero Server Uploads
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_INPUT_TYPES}
          onChange={handleFileChange}
          className="sr-only"
          aria-hidden="true"
          multiple={multiple}
        />
        <input
          ref={folderInputRef}
          type="file"
          onChange={handleFileChange}
          className="sr-only"
          aria-hidden="true"
          multiple={multiple}
        />
      </div>
    </div>
  );
}
