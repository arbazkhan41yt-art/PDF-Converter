import type { Tool } from '@/types';

export const tools: Tool[] = [
  // Organize PDF
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
    icon: 'Merge',
    category: 'Organize PDF',
    color: '#dc2626',
    bgColor: '#fef2f2',
    route: '/merge-pdf',
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    icon: 'Split',
    category: 'Organize PDF',
    color: '#dc2626',
    bgColor: '#fef2f2',
    route: '/split-pdf',
  },
  {
    id: 'organize-pdf',
    name: 'Organize PDF',
    description: 'Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages to your document at your convenience.',
    icon: 'Organize',
    category: 'Organize PDF',
    color: '#ea580c',
    bgColor: '#fff7ed',
    route: '/organize-pdf',
  },
  
  // Optimize PDF
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality.',
    icon: 'Compress',
    category: 'Optimize PDF',
    color: '#16a34a',
    bgColor: '#f0fdf4',
    route: '/compress-pdf',
  },
  
  // Convert to PDF
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.',
    icon: 'ImageToPdf',
    category: 'Convert PDF',
    color: '#ca8a04',
    bgColor: '#fefce8',
    route: '/jpg-to-pdf',
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
    icon: 'WordToPdf',
    category: 'Convert PDF',
    color: '#2563eb',
    bgColor: '#eff6ff',
    route: '/word-to-pdf',
  },
  {
    id: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.',
    icon: 'PptToPdf',
    category: 'Convert PDF',
    color: '#ea580c',
    bgColor: '#fff7ed',
    route: '/powerpoint-to-pdf',
  },
  {
    id: 'excel-to-pdf',
    name: 'Excel to PDF',
    description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.',
    icon: 'ExcelToPdf',
    category: 'Convert PDF',
    color: '#16a34a',
    bgColor: '#f0fdf4',
    route: '/excel-to-pdf',
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    description: 'Convert webpages in HTML to PDF. Copy and paste the URL of the page you want and convert it to PDF with a click.',
    icon: 'HtmlToPdf',
    category: 'Convert PDF',
    color: '#ca8a04',
    bgColor: '#fefce8',
    route: '/html-to-pdf',
  },
  
  // Convert from PDF
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
    icon: 'PdfToImage',
    category: 'Convert PDF',
    color: '#ca8a04',
    bgColor: '#fefce8',
    route: '/pdf-to-jpg',
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents. The converted WORD document is almost 100% accurate.',
    icon: 'PdfToWord',
    category: 'Convert PDF',
    color: '#2563eb',
    bgColor: '#eff6ff',
    route: '/pdf-to-word',
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.',
    icon: 'PdfToPpt',
    category: 'Convert PDF',
    color: '#ea580c',
    bgColor: '#fff7ed',
    route: '/pdf-to-powerpoint',
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    description: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.',
    icon: 'PdfToExcel',
    category: 'Convert PDF',
    color: '#16a34a',
    bgColor: '#f0fdf4',
    route: '/pdf-to-excel',
  },
  {
    id: 'pdf-to-html',
    name: 'PDF to HTML',
    description: 'Convert your PDF documents to HTML web pages.',
    icon: 'PdfToHtml',
    category: 'Convert PDF',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    route: '/pdf-to-html',
  },
  
  // Edit PDF
  {
    id: 'edit-pdf',
    name: 'Edit PDF',
    description: 'Add text, images, shapes or freehand annotations to a PDF document. Edit the size, font, and color of the added content.',
    icon: 'Edit',
    category: 'Edit PDF',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    route: '/edit-pdf',
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once!',
    icon: 'Rotate',
    category: 'Edit PDF',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    route: '/rotate-pdf',
  },
  {
    id: 'add-watermark',
    name: 'Add Watermark',
    description: 'Stamp an image or text over your PDF in seconds. Choose the typography, transparency and position.',
    icon: 'Watermark',
    category: 'Edit PDF',
    color: '#db2777',
    bgColor: '#fdf2f8',
    route: '/add-watermark',
  },
  {
    id: 'add-page-numbers',
    name: 'Add Page Numbers',
    description: 'Add page numbers into PDFs with ease. Choose your positions, dimensions, typography.',
    icon: 'PageNumbers',
    category: 'Edit PDF',
    color: '#9333ea',
    bgColor: '#faf5ff',
    route: '/add-page-numbers',
  },
  {
    id: 'crop-pdf',
    name: 'Crop PDF',
    description: 'Crop margins of PDF documents or select specific areas, then apply the changes to one page or the whole document.',
    icon: 'Crop',
    category: 'Edit PDF',
    color: '#0891b2',
    bgColor: '#ecfeff',
    route: '/crop-pdf',
  },
  
  // PDF Security
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    description: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.',
    icon: 'Protect',
    category: 'PDF Security',
    color: '#2563eb',
    bgColor: '#eff6ff',
    route: '/protect-pdf',
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.',
    icon: 'Unlock',
    category: 'PDF Security',
    color: '#2563eb',
    bgColor: '#eff6ff',
    route: '/unlock-pdf',
  },
];

export const getToolsByCategory = (category: string): Tool[] => {
  if (category === 'All') return tools;
  if (category === 'Workflows') return [];
  return tools.filter(tool => tool.category === category);
};

export const getToolByRoute = (route: string): Tool | undefined => {
  return tools.find(tool => tool.route === route);
};

export const categories = ['All', 'Workflows', 'Organize PDF', 'Optimize PDF', 'Convert PDF', 'Edit PDF', 'PDF Security'];
