/**
 * DOCK 71 CANTÙ - OTTIMIZZATORE & CONVERTITORE NATIVO IMMAGINI (WEBP & AVIF)
 * 
 * Converte e comprime qualsiasi immagine caricata (JPG, PNG, WEBP, AVIF)
 * nel formato ottimizzato WebP (o AVIF), riducendo il peso per massime prestazioni
 * e salvando sia su backend /uploads/images/ che nel frontend.
 */

export interface OptimizedImageResult {
  url: string;
  format: 'webp' | 'avif';
  fileName: string;
  originalSize: number;
  compressedSize: number;
  savedPercentage: number;
  width: number;
  height: number;
}

/**
 * Converte e ottimizza un file immagine nativamente nel browser in WebP/AVIF,
 * inviando contestualmente la richiesta al backend PHP (/backend/upload-media.php).
 */
export async function optimizeAndUploadImage(
  file: File,
  options: {
    targetFormat?: 'webp' | 'avif';
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    altText?: string;
  } = {}
): Promise<OptimizedImageResult> {
  const {
    targetFormat = 'webp',
    quality = 0.85,
    maxWidth = 1920,
    maxHeight = 1440,
    altText = ''
  } = options;

  // 1. Elaborazione client-side per rendering immediato e compressione canvas
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  // Calcola proporzioni ottimali
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  // Disegna su Canvas con smoothing elevato
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Contesto Canvas non disponibile');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  // Mime type desiderato
  const mimeType = targetFormat === 'avif' ? 'image/avif' : 'image/webp';
  let clientWebpUrl = canvas.toDataURL(mimeType, quality);
  
  // Se il browser non supporta 'image/avif' su toDataURL, usa 'image/webp'
  if (targetFormat === 'avif' && !clientWebpUrl.startsWith('data:image/avif')) {
    clientWebpUrl = canvas.toDataURL('image/webp', quality);
  }

  const cleanBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueId = Date.now();
  const generatedFileName = `${cleanBase}_${uniqueId}.${targetFormat}`;

  let finalUrl = clientWebpUrl;
  let compressedBytes = Math.round((clientWebpUrl.length * 3) / 4);

  // 2. Tenta invio multipart al backend PHP /backend/upload-media.php
  try {
    const formData = new FormData();
    formData.append('media_file', file);
    formData.append('target_format', targetFormat);
    formData.append('alt_text', altText);

    const response = await fetch('/backend/upload-media.php', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.file_path) {
        // Usa il percorso permanente salvato sul server
        finalUrl = data.file_path;
        if (data.file_size) compressedBytes = data.file_size;
      }
    }
  } catch (err) {
    // In ambiente anteprima locale / statico usa l'immagine convertita client-side
    console.debug('Upload server fallback to client-side optimized WebP:', err);
  }

  const savedPct = file.size > 0 
    ? Math.max(0, Math.round(((file.size - compressedBytes) / file.size) * 100))
    : 0;

  return {
    url: finalUrl,
    format: targetFormat,
    fileName: generatedFileName,
    originalSize: file.size,
    compressedSize: compressedBytes,
    savedPercentage: savedPct,
    width,
    height
  };
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
