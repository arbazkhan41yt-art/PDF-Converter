import * as XLSX from 'xlsx';
import PptxGenJS from 'pptxgenjs';
import type { FileWithPreview } from '@/types';
import { createPDFFromImages } from './pdfUtils';

// Word to PDF conversion
export const convertWordToPDF = async (file: FileWithPreview): Promise<Blob> => {
  const text = await readFileAsText(file.file);
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF();
  
  const lines = text.split('\n');
  let y = 20;
  const lineHeight = 7;
  const pageHeight = 280;
  
  pdf.setFontSize(12);
  
  for (const line of lines) {
    if (y > pageHeight) {
      pdf.addPage();
      y = 20;
    }
    pdf.text(line, 20, y);
    y += lineHeight;
  }
  
  return pdf.output('blob');
};

// PDF to Word conversion (extracts text)
export const convertPDFToWord = async (file: FileWithPreview): Promise<Blob> => {
  const arrayBuffer = await file.file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
  }
  
  const blob = new Blob([fullText], { type: 'application/msword' });
  return blob;
};

// Excel to PDF conversion
export const convertExcelToPDF = async (file: FileWithPreview): Promise<Blob> => {
  const arrayBuffer = await file.file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF('landscape');
  
  let firstSheet = true;
  
  for (const sheetName of workbook.SheetNames) {
    if (!firstSheet) {
      pdf.addPage('landscape');
    }
    firstSheet = false;
    
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    
    pdf.setFontSize(10);
    let y = 20;
    const cellHeight = 6;
    const cellWidth = 30;
    
    for (let rowIndex = 0; rowIndex < Math.min(data.length, 40); rowIndex++) {
      const row = data[rowIndex];
      let x = 10;
      
      for (let colIndex = 0; colIndex < Math.min(row?.length || 0, 10); colIndex++) {
        const cell = row[colIndex];
        if (cell !== undefined && cell !== null) {
          pdf.text(String(cell).substring(0, 20), x, y);
        }
        x += cellWidth;
      }
      
      y += cellHeight;
      if (y > 180) {
        pdf.addPage('landscape');
        y = 20;
      }
    }
  }
  
  return pdf.output('blob');
};

// PDF to Excel conversion
export const convertPDFToExcel = async (file: FileWithPreview): Promise<Blob> => {
  const arrayBuffer = await file.file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const workbook = XLSX.utils.book_new();
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    const lines: string[][] = [];
    let currentLine: string[] = [];
    let lastY: number | null = null;
    
    for (const item of textContent.items as any[]) {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
        if (currentLine.length > 0) {
          lines.push([...currentLine]);
          currentLine = [];
        }
      }
      currentLine.push(item.str);
      lastY = item.transform[5];
    }
    
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    
    const worksheet = XLSX.utils.aoa_to_sheet(lines);
    XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${pageNum}`);
  }
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

// PowerPoint to PDF conversion
export const convertPowerPointToPDF = async (file: FileWithPreview): Promise<Blob> => {
  const images: FileWithPreview[] = [file];
  return createPDFFromImages(images, { orientation: 'landscape' });
};

// PDF to PowerPoint conversion
export const convertPDFToPowerPoint = async (file: FileWithPreview): Promise<Blob> => {
  const arrayBuffer = await file.file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pptx = new PptxGenJS();
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    if (context) {
      await page.render({ canvasContext: context, viewport, canvas }).promise;
      
      const slide = pptx.addSlide();
      const imgData = canvas.toDataURL('image/png');
      
      slide.addImage({
        data: imgData,
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
      });
    }
  }
  
  return await pptx.write({ type: 'blob' } as any) as Blob;
};

// PDF to HTML conversion
export const convertPDFToHTML = async (file: FileWithPreview): Promise<Blob> => {
  const arrayBuffer = await file.file.arrayBuffer();
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Converted from ${file.name}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .page { border: 1px solid #ccc; padding: 20px; margin-bottom: 20px; }
    .page-number { text-align: center; color: #666; margin-top: 10px; }
  </style>
</head>
<body>
  <h1>${file.name}</h1>
`;
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    
    html += `
  <div class="page">
    <p>${pageText}</p>
    <div class="page-number">Page ${pageNum}</div>
  </div>
`;
  }
  
  html += `
</body>
</html>`;
  
  return new Blob([html], { type: 'text/html' });
};

// Helper function
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
