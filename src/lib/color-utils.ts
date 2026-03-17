export interface ColorPalette {
  dominant: string;
  palette: string[];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

export async function extractColors(imageUrl: string): Promise<ColorPalette> {
  // @ts-ignore
  let CT;
  try {
    CT = await import("colorthief");
  } catch (e) {
    console.error("Failed to load colorthief", e);
    return { dominant: "#cccccc", palette: [] };
  }
  
  const ColorThief = CT.default || CT;
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const colorThief = new ColorThief();
    
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      try {
        const dominantRgb = colorThief.getColor(img);
        const paletteRgb = colorThief.getPalette(img, 5); // get 5 colors
        
        resolve({
          dominant: rgbToHex(dominantRgb[0], dominantRgb[1], dominantRgb[2]),
          palette: paletteRgb.map((color: [number, number, number]) => rgbToHex(color[0], color[1], color[2]))
        });
      } catch (err) {
        reject(err);
      }
    };
    
    img.onerror = () => {
      reject(new Error("Failed to load image for color extraction"));
    };
    
    img.src = imageUrl;
  });
}