import JSZip from "jszip";
import jsPDF from "jspdf";
import { type BatchItem } from "@/hooks/useImageConversion";
import { getOutputFilename } from "./image-converter";

export async function downloadAsZip(items: BatchItem[], prefix: string = "") {
  const zip = new JSZip();
  const validItems = items.filter((i) => i.state === "done" && i.result);

  if (validItems.length === 0) return;

  validItems.forEach((item, index) => {
    const filename = getOutputFilename(
      item.imageInfo.file.name,
      item.result!.format,
      prefix ? `${prefix}_` : ""
    );
    // Resolve naming collisions if any
    const uniqueName = `${index + 1}_${filename}`;
    zip.file(uniqueName, item.result!.blob);
  });

  const content = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(content);
  a.download = `Converted_Images_${new Date().getTime()}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

export async function downloadAsPDF(items: BatchItem[]) {
  const validItems = items.filter((i) => i.state === "done" && i.result);
  if (validItems.length === 0) return;

  // A4 size in mm is 210 x 297
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < validItems.length; i++) {
    const item = validItems[i];
    const result = item.result!;
    
    if (i > 0) {
      pdf.addPage();
    }

    // Read the blob as base64 to add to PDF
    const base64data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(result.blob);
    });

    const imgWidth = result.width;
    const imgHeight = result.height;
    const ratio = imgWidth / imgHeight;

    // Scale to fit page
    let finalWidth = pageWidth - 20; // 10mm padding on each side
    let finalHeight = finalWidth / ratio;

    if (finalHeight > pageHeight - 20) {
      finalHeight = pageHeight - 20;
      finalWidth = finalHeight * ratio;
    }

    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2;

    const imgType = result.format === "image/png" ? "PNG" : "JPEG";
    pdf.addImage(base64data, imgType, x, y, finalWidth, finalHeight);
  }

  pdf.save(`Converted_Images_${new Date().getTime()}.pdf`);
}