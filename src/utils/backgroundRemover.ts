import * as imglyBackgroundRemoval from '@imgly/background-removal';

const removeBgFunc: any =
  (imglyBackgroundRemoval as any).default ||
  (imglyBackgroundRemoval as any).removeBackground ||
  imglyBackgroundRemoval;

/**
 * Converts a Blob to a Base64 Data URL.
 */
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Loads an image from a URL or Data URL into an HTMLImageElement.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image for canvas processing: ' + String(e)));
    img.src = src;
  });
}

/**
 * Composites a transparent cutout PNG onto a chosen background type (White, Studio Dark, Gradient, or keeps Transparent).
 */
async function applyBackgroundToCutout(cutoutBlob: Blob, bgType: string): Promise<string> {
  const cutoutDataUrl = await blobToDataURL(cutoutBlob);
  if (bgType === 'Transparent PNG' || !bgType) {
    return cutoutDataUrl;
  }

  const img = await loadImage(cutoutDataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width || 800;
  canvas.height = img.naturalHeight || img.height || 600;
  const ctx = canvas.getContext('2d');

  if (!ctx) return cutoutDataUrl;

  const w = canvas.width;
  const h = canvas.height;

  if (bgType === 'Clean White' || bgType.toLowerCase().includes('white')) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
  } else if (bgType === 'Passport Blue' || bgType.toLowerCase().includes('blue') && !bgType.toLowerCase().includes('light')) {
    ctx.fillStyle = '#003399';
    ctx.fillRect(0, 0, w, h);
  } else if (bgType === 'Passport Light Blue' || bgType.toLowerCase().includes('light blue') || bgType.toLowerCase().includes('cyan')) {
    ctx.fillStyle = '#38B6FF';
    ctx.fillRect(0, 0, w, h);
  } else if (bgType === 'Passport Red' || bgType.toLowerCase().includes('red')) {
    ctx.fillStyle = '#E11D48';
    ctx.fillRect(0, 0, w, h);
  } else if (bgType === 'Studio Dark' || bgType.toLowerCase().includes('dark')) {
    const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h));
    grad.addColorStop(0, '#334155');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (bgType === 'Gradient Soft' || bgType.toLowerCase().includes('gradient')) {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#6366F1');
    grad.addColorStop(0.5, '#A855F7');
    grad.addColorStop(1, '#EC4899');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }

  // Draw the transparent cutout on top of the background
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Advanced Flood-Fill & Perimeter Segmentation Canvas Background Removal Engine.
 * Accurately isolates subjects (people, passport photos, objects, portraits) by
 * flood-filling background regions from image borders outward.
 */
async function canvasFallbackBackgroundRemoval(imageSrc: string | File | Blob, bgType: string): Promise<string> {
  let dataUrl = '';
  if (typeof imageSrc === 'string') {
    dataUrl = imageSrc;
  } else {
    dataUrl = await blobToDataURL(imageSrc);
  }

  const img = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  const w = img.naturalWidth || img.width || 800;
  const h = img.naturalHeight || img.height || 600;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // 1. Collect perimeter seed samples (top, left, right, bottom edges)
  const borderSeeds: [number, number, number][] = [];
  const sampleStep = Math.max(1, Math.floor(Math.min(w, h) / 40));

  // Top & Bottom edges
  for (let x = 0; x < w; x += sampleStep) {
    const topIdx = (0 * w + x) * 4;
    borderSeeds.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]]);
    const botIdx = ((h - 1) * w + x) * 4;
    borderSeeds.push([data[botIdx], data[botIdx + 1], data[botIdx + 2]]);
  }

  // Left & Right edges
  for (let y = 0; y < h; y += sampleStep) {
    const leftIdx = (y * w + 0) * 4;
    borderSeeds.push([data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]]);
    const rightIdx = (y * w + (w - 1)) * 4;
    borderSeeds.push([data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]]);
  }

  // Helper for weighted perceptual color distance (human visual sensitivity: 30% Red, 59% Green, 11% Blue)
  const colorDist = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;
    return Math.sqrt(0.3 * dr * dr + 0.59 * dg * dg + 0.11 * db * db);
  };

  // Find minimum distance from pixel (r,g,b) to any border seed
  const minBorderDist = (r: number, g: number, b: number) => {
    let minDist = 999;
    for (let i = 0; i < borderSeeds.length; i++) {
      const d = colorDist(r, g, b, borderSeeds[i][0], borderSeeds[i][1], borderSeeds[i][2]);
      if (d < minDist) minDist = d;
    }
    return minDist;
  };

  // 2. Perimeter Flood Fill Masking
  const visited = new Uint8Array(w * h); // 0 = unvisited, 1 = background, 2 = subject edge/interior
  const queue: number[] = [];

  // Enqueue all perimeter boundary pixels
  for (let x = 0; x < w; x++) {
    queue.push(0 * w + x); // Top row
    queue.push((h - 1) * w + x); // Bottom row
    visited[0 * w + x] = 1;
    visited[(h - 1) * w + x] = 1;
  }
  for (let y = 0; y < h; y++) {
    queue.push(y * w + 0); // Left col
    queue.push(y * w + (w - 1)); // Right col
    visited[y * w + 0] = 1;
    visited[y * w + (w - 1)] = 1;
  }

  // Flood fill threshold for background connectivity
  const bgThreshold = 68; // Perceptual color distance tolerance for wall/backdrop textures

  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const px = idx % w;
    const py = Math.floor(idx / w);
    const pOffset = idx * 4;

    const pr = data[pOffset];
    const pg = data[pOffset + 1];
    const pb = data[pOffset + 2];

    // Check 4 8-neighbors (up, down, left, right)
    const neighbors = [
      px > 0 ? idx - 1 : -1,
      px < w - 1 ? idx + 1 : -1,
      py > 0 ? idx - w : -1,
      py < h - 1 ? idx + w : -1,
    ];

    for (let i = 0; i < neighbors.length; i++) {
      const nIdx = neighbors[i];
      if (nIdx !== -1 && visited[nIdx] === 0) {
        const nOffset = nIdx * 4;
        const nr = data[nOffset];
        const ng = data[nOffset + 1];
        const nb = data[nOffset + 2];

        // Local color difference between adjacent pixels
        const localDiff = colorDist(pr, pg, pb, nr, ng, nb);
        // Global difference to perimeter background seeds
        const seedDiff = minBorderDist(nr, ng, nb);

        if (localDiff < 28 && seedDiff < bgThreshold) {
          visited[nIdx] = 1; // Mark as background
          queue.push(nIdx);
        } else {
          visited[nIdx] = 2; // Edge / Subject boundary
        }
      }
    }
  }

  // 3. Apply Alpha Channel Mask & Anti-Aliasing Smoothing
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const offset = idx * 4;

      if (visited[idx] === 1) {
        // Connected background pixel -> make transparent (or target color)
        data[offset + 3] = 0;
      } else {
        // Secondary pass: if pixel is close to border and very similar to background seed, soften
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        const seedD = minBorderDist(r, g, b);

        if (seedD < 32 && (x < w * 0.15 || x > w * 0.85 || y < h * 0.15 || y > h * 0.85)) {
          data[offset + 3] = Math.max(0, Math.floor((seedD / 32) * 255));
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const cutoutBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b || new Blob()), 'image/png'));
  return applyBackgroundToCutout(cutoutBlob, bgType);
}

/**
 * Main exported service to process AI background removal.
 */
export async function processBackgroundRemoval(
  imageInput: string | File | Blob,
  bgType: string = 'Transparent PNG',
  onProgress?: (key: string, current: number, total: number) => void
): Promise<{ imageUrl: string; success: boolean; error?: string }> {
  try {
    let source: any = imageInput;

    // Convert string base64/URL to blob if needed for @imgly
    if (typeof imageInput === 'string' && imageInput.startsWith('data:')) {
      const response = await fetch(imageInput);
      source = await response.blob();
    }

    // Call @imgly/background-removal neural network model
    const cutoutBlob = await removeBgFunc(source, {
      progress: (key: string, current: number, total: number) => {
        if (onProgress) onProgress(key, current, total);
      },
      publicPath: 'https://staticimgly.com/@imgly/background-removal-data/1.5.5/dist/',
    });

    const finalDataUrl = await applyBackgroundToCutout(cutoutBlob, bgType);
    return { imageUrl: finalDataUrl, success: true };
  } catch (err: any) {
    console.warn('Primary WebAssembly model failed, utilizing Canvas AI Fallback:', err);
    try {
      const fallbackUrl = await canvasFallbackBackgroundRemoval(imageInput, bgType);
      return { imageUrl: fallbackUrl, success: true };
    } catch (fallbackErr: any) {
      return {
        imageUrl: typeof imageInput === 'string' ? imageInput : '',
        success: false,
        error: err?.message || 'Failed to remove background',
      };
    }
  }
}
