import jsPDF from 'jspdf';
import type { ConversionOptions, FileWithPreview } from '@/types';

export const createPDFFromImages = async (
  files: FileWithPreview[],
  options: ConversionOptions = {}
): Promise<Blob> => {
  const { orientation = 'portrait', margin = 'none', pageSize = 'a4' } = options;
  
  const pageDimensions: Record<string, { width: number; height: number }> = {
    a4: { width: 210, height: 297 },
    letter: { width: 215.9, height: 279.4 },
    legal: { width: 215.9, height: 355.6 },
  };

  const dimensions = pageDimensions[pageSize] || pageDimensions.a4;
  const isLandscape = orientation === 'landscape';
  const pdfWidth = isLandscape ? dimensions.height : dimensions.width;
  const pdfHeight = isLandscape ? dimensions.width : dimensions.height;

  const marginValues: Record<string, number> = {
    none: 0,
    small: 10,
    medium: 20,
    large: 30,
  };
  const marginSize = marginValues[margin] || 0;

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize,
  });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (i > 0) {
      pdf.addPage();
    }

    const imageData = await readFileAsDataURL(file.file);
    const img = await loadImage(imageData);
    
    const availableWidth = pdfWidth - (marginSize * 2);
    const availableHeight = pdfHeight - (marginSize * 2);
    
    const imgRatio = img.width / img.height;
    const pageRatio = availableWidth / availableHeight;
    
    let imgWidth = availableWidth;
    let imgHeight = availableHeight;
    
    if (imgRatio > pageRatio) {
      imgHeight = availableWidth / imgRatio;
    } else {
      imgWidth = availableHeight * imgRatio;
    }
    
    const x = marginSize + (availableWidth - imgWidth) / 2;
    const y = marginSize + (availableHeight - imgHeight) / 2;

    const imageFormat = file.type === 'image/png' ? 'PNG' : 'JPEG';
    pdf.addImage(imageData, imageFormat, x, y, imgWidth, imgHeight);
  }

  return pdf.output('blob');
};

export const mergePDFs = async (
  files: FileWithPreview[]
): Promise<Blob> => {
  const pdfDoc = new jsPDF();
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const arrayBuffer = await file.file.arrayBuffer();
    
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        if (context) {
          await page.render({ canvasContext: context, viewport, canvas }).promise;
          
          if (i > 0 || pageNum > 1) {
            pdfDoc.addPage();
          }
          
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const imgProps = pdfDoc.getImageProperties(imgData);
          const pdfWidth = pdfDoc.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          pdfDoc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
    }
  }
  
  return pdfDoc.output('blob');
};

export const splitPDF = async (
  file: FileWithPreview,
  pageRanges: string
): Promise<Blob> => {
  const pdfDoc = new jsPDF();
  
  const arrayBuffer = await file.file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = parsePageRanges(pageRanges, pdf.numPages);
  
  for (let i = 0; i < pages.length; i++) {
    const pageNum = pages[i];
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    if (context) {
      await page.render({ canvasContext: context, viewport, canvas }).promise;
      
      if (i > 0) {
        pdfDoc.addPage();
      }
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgProps = pdfDoc.getImageProperties(imgData);
      const pdfWidth = pdfDoc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdfDoc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
  }
  
  return pdfDoc.output('blob');
};

export const pdfToImages = async (
  file: FileWithPreview,
  format: 'jpg' | 'png' = 'jpg'
): Promise<Blob[]> => {
  const arrayBuffer = await file.file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const images: Blob[] = [];
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    if (context) {
      await page.render({ canvasContext: context, viewport, canvas }).promise;
      
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'png' ? undefined : 0.95;
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), mimeType, quality);
      });
      
      images.push(blob);
    }
  }
  
  return images;
};

export const compressPDF = async (
  file: FileWithPreview,
  quality: 'low' | 'medium' | 'high' = 'medium'
): Promise<Blob> => {
  const scaleValues: Record<string, number> = {
    low: 1.0,
    medium: 1.5,
    high: 2.0,
  };
  const scale = scaleValues[quality] || 1.5;
  
  const pdfDoc = new jsPDF();
  
  const arrayBuffer = await file.file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    if (context) {
      await page.render({ canvasContext: context, viewport, canvas }).promise;
      
      if (pageNum > 1) {
        pdfDoc.addPage();
      }
      
      const imgData = canvas.toDataURL('image/jpeg', quality === 'low' ? 0.7 : quality === 'medium' ? 0.85 : 0.95);
      const imgProps = pdfDoc.getImageProperties(imgData);
      const pdfWidth = pdfDoc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdfDoc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
  }
  
  return pdfDoc.output('blob');
};

export const rotatePDF = async (
  file: FileWithPreview,
  rotation: 0 | 90 | 180 | 270 = 90
): Promise<Blob> => {
  const pdfDoc = new jsPDF(rotation === 90 || rotation === 270 ? 'landscape' : 'portrait');
  
  const arrayBuffer = await file.file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5, rotation: rotation + page.rotate });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    if (context) {
      await page.render({ canvasContext: context, viewport, canvas }).promise;
      
      if (pageNum > 1) {
        pdfDoc.addPage(pdfDoc.internal.pageSize.getWidth() > pdfDoc.internal.pageSize.getHeight() ? 'landscape' : 'portrait');
      }
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgProps = pdfDoc.getImageProperties(imgData);
      const pdfWidth = pdfDoc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdfDoc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
  }
  
  return pdfDoc.output('blob');
};

export const addWatermarkToPDF = async (
  file: FileWithPreview,
  watermarkText: string,
  options: ConversionOptions = {}
): Promise<Blob> => {
  const pdfDoc = new jsPDF();
  
  const arrayBuffer = await file.file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  const opacity = options.watermark?.opacity || 0.3;
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    if (context) {
      await page.render({ canvasContext: context, viewport, canvas }).promise;
      
      context.save();
      context.globalAlpha = opacity;
      context.font = 'bold 48px Arial';
      context.fillStyle = '#888888';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      context.translate(centerX, centerY);
      context.rotate(-Math.PI / 6);
      context.fillText(watermarkText, 0, 0);
      context.restore();
      
      if (pageNum > 1) {
        pdfDoc.addPage();
      }
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgProps = pdfDoc.getImageProperties(imgData);
      const pdfWidth = pdfDoc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdfDoc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
  }
  
  return pdfDoc.output('blob');
};

export const addPageNumbersToPDF = async (
  file: FileWithPreview,
  options: ConversionOptions = {}
): Promise<Blob> => {
  const pdfDoc = new jsPDF();
  
  const arrayBuffer = await file.file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  const position = options.pageNumbers?.position || 'bottom-center';
  const startNumber = options.pageNumbers?.startNumber || 1;
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    if (context) {
      await page.render({ canvasContext: context, viewport, canvas }).promise;
      
      context.font = '16px Arial';
      context.fillStyle = '#333333';
      context.textAlign = 'center';
      
      const pageNumber = startNumber + pageNum - 1;
      const text = `${pageNumber}`;
      
      let x = canvas.width / 2;
      let y = canvas.height - 20;
      
      if (position.includes('left')) x = 40;
      if (position.includes('right')) x = canvas.width - 40;
      if (position.includes('top')) y = 30;
      
      context.fillText(text, x, y);
      
      if (pageNum > 1) {
        pdfDoc.addPage();
      }
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgProps = pdfDoc.getImageProperties(imgData);
      const pdfWidth = pdfDoc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdfDoc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
  }
  
  return pdfDoc.output('blob');
};

export const protectPDF = async (
  file: FileWithPreview
): Promise<Blob> => {
  return file.file;
};

// Helper functions
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const parsePageRanges = (ranges: string, totalPages: number): number[] => {
  const pages: number[] = [];
  const parts = ranges.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(Number);
      for (let i = start; i <= Math.min(end, totalPages); i++) {
        pages.push(i);
      }
    } else {
      const page = Number(trimmed);
      if (page > 0 && page <= totalPages) {
        pages.push(page);
      }
    }
  }
  
  return pages.length > 0 ? pages : [1];
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
