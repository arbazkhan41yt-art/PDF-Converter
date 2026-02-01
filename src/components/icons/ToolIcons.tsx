import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const MergeIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="4" y="12" width="16" height="24" rx="2" fill="#dc2626" opacity="0.8"/>
    <rect x="20" y="12" width="16" height="24" rx="2" fill="#ef4444" opacity="0.9"/>
    <path d="M32 24L36 24M36 24L33 21M36 24L33 27" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 24L12 24M12 24L15 21M12 24L15 27" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SplitIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="6" y="12" width="14" height="24" rx="2" fill="#dc2626" opacity="0.8"/>
    <rect x="28" y="12" width="14" height="24" rx="2" fill="#ef4444" opacity="0.9"/>
    <path d="M24 18V30M24 18L21 21M24 18L27 21M24 30L21 27M24 30L27 27" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CompressIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="10" y="8" width="28" height="32" rx="3" fill="#16a34a" opacity="0.2"/>
    <rect x="14" y="12" width="20" height="24" rx="2" fill="#16a34a" opacity="0.6"/>
    <path d="M18 20L22 24L18 28" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30 20L26 24L30 28" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 32L24 16" stroke="#16a34a" strokeWidth="2" strokeDasharray="2 2"/>
  </svg>
);

export const ImageToPdfIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="6" y="8" width="20" height="16" rx="2" fill="#ca8a04" opacity="0.8"/>
    <circle cx="14" cy="16" r="3" fill="white" opacity="0.6"/>
    <path d="M6 20L12 14L18 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
    <rect x="18" y="22" width="24" height="18" rx="2" fill="#dc2626" opacity="0.9"/>
    <path d="M22 34L26 28L30 32L34 26" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M36 24V36H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const PdfToImageIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="6" y="8" width="24" height="18" rx="2" fill="#dc2626" opacity="0.9"/>
    <path d="M10 20L14 14L18 18L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 10V22H8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <rect x="22" y="22" width="20" height="16" rx="2" fill="#ca8a04" opacity="0.8"/>
    <circle cx="30" cy="30" r="3" fill="white" opacity="0.6"/>
    <path d="M22 34L28 28L34 32" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
  </svg>
);

export const WordToPdfIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="4" y="10" width="20" height="28" rx="2" fill="#2563eb" opacity="0.9"/>
    <text x="8" y="30" fill="white" fontSize="14" fontWeight="bold">W</text>
    <rect x="20" y="22" width="24" height="18" rx="2" fill="#dc2626" opacity="0.9"/>
    <path d="M24 34L28 28L32 32L36 26" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M38 24V36H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const PdfToWordIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="4" y="10" width="24" height="18" rx="2" fill="#dc2626" opacity="0.9"/>
    <path d="M8 22L12 16L16 20L20 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 12V24H6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <rect x="24" y="22" width="20" height="18" rx="2" fill="#2563eb" opacity="0.9"/>
    <text x="28" y="34" fill="white" fontSize="12" fontWeight="bold">W</text>
  </svg>
);

export const PptToPdfIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="4" y="10" width="20" height="28" rx="2" fill="#ea580c" opacity="0.9"/>
    <text x="8" y="30" fill="white" fontSize="14" fontWeight="bold">P</text>
    <rect x="20" y="22" width="24" height="18" rx="2" fill="#dc2626" opacity="0.9"/>
    <path d="M24 34L28 28L32 32L36 26" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M38 24V36H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const PdfToPptIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="4" y="10" width="24" height="18" rx="2" fill="#dc2626" opacity="0.9"/>
    <path d="M8 22L12 16L16 20L20 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 12V24H6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <rect x="24" y="22" width="20" height="18" rx="2" fill="#ea580c" opacity="0.9"/>
    <text x="28" y="34" fill="white" fontSize="12" fontWeight="bold">P</text>
  </svg>
);

export const ExcelToPdfIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="4" y="10" width="20" height="28" rx="2" fill="#16a34a" opacity="0.9"/>
    <text x="8" y="30" fill="white" fontSize="12" fontWeight="bold">X</text>
    <rect x="20" y="22" width="24" height="18" rx="2" fill="#dc2626" opacity="0.9"/>
    <path d="M24 34L28 28L32 32L36 26" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M38 24V36H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const PdfToExcelIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="4" y="10" width="24" height="18" rx="2" fill="#dc2626" opacity="0.9"/>
    <path d="M8 22L12 16L16 20L20 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 12V24H6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <rect x="24" y="22" width="20" height="18" rx="2" fill="#16a34a" opacity="0.9"/>
    <text x="28" y="34" fill="white" fontSize="10" fontWeight="bold">X</text>
  </svg>
);

export const HtmlToPdfIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="4" y="10" width="20" height="28" rx="2" fill="#ca8a04" opacity="0.8"/>
    <text x="6" y="28" fill="white" fontSize="10" fontWeight="bold">HTML</text>
    <rect x="20" y="22" width="24" height="18" rx="2" fill="#dc2626" opacity="0.9"/>
    <path d="M24 34L28 28L32 32L36 26" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M38 24V36H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const PdfToHtmlIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="4" y="10" width="24" height="18" rx="2" fill="#dc2626" opacity="0.9"/>
    <path d="M8 22L12 16L16 20L20 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 12V24H6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <rect x="24" y="22" width="20" height="18" rx="2" fill="#7c3aed" opacity="0.8"/>
    <text x="26" y="34" fill="white" fontSize="8" fontWeight="bold">HTML</text>
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#7c3aed" opacity="0.2"/>
    <rect x="12" y="12" width="24" height="24" rx="2" fill="#7c3aed" opacity="0.6"/>
    <path d="M18 24H22M18 28H26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M28 18L30 20L34 16L32 14L28 18Z" fill="white"/>
    <path d="M26 20L28 22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const RotateIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="8" y="10" width="32" height="28" rx="2" fill="#7c3aed" opacity="0.2"/>
    <rect x="12" y="14" width="24" height="20" rx="2" fill="#7c3aed" opacity="0.6"/>
    <path d="M36 16C38 18 39 21 39 24C39 30 34 35 28 35" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M32 12L36 16L32 20" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const WatermarkIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#db2777" opacity="0.2"/>
    <rect x="12" y="12" width="24" height="24" rx="2" fill="#db2777" opacity="0.4"/>
    <text x="14" y="28" fill="white" fontSize="8" opacity="0.5" transform="rotate(-15 24 24)">WATERMARK</text>
    <circle cx="34" cy="14" r="6" fill="#db2777" opacity="0.8"/>
    <path d="M32 14L34 16L37 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PageNumbersIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#9333ea" opacity="0.2"/>
    <rect x="12" y="12" width="24" height="24" rx="2" fill="#9333ea" opacity="0.4"/>
    <rect x="16" y="28" width="6" height="6" rx="1" fill="white" opacity="0.8"/>
    <text x="17" y="33" fill="#9333ea" fontSize="5" fontWeight="bold">1</text>
    <rect x="26" y="28" width="6" height="6" rx="1" fill="white" opacity="0.6"/>
    <text x="27" y="33" fill="#9333ea" fontSize="5" fontWeight="bold">2</text>
    <path d="M14 20H34" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    <path d="M14 16H28" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export const CropIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#0891b2" opacity="0.2"/>
    <rect x="14" y="14" width="20" height="20" rx="1" stroke="#0891b2" strokeWidth="2" strokeDasharray="3 3" fill="none"/>
    <path d="M10 14V10H14" stroke="#0891b2" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M38 14V10H34" stroke="#0891b2" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M10 34V38H14" stroke="#0891b2" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M38 34V38H34" stroke="#0891b2" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const ProtectIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#2563eb" opacity="0.2"/>
    <path d="M24 12L12 18V24C12 32 17 38.5 24 42C31 38.5 36 32 36 24V18L24 12Z" fill="#2563eb" opacity="0.8"/>
    <circle cx="24" cy="26" r="4" fill="white"/>
    <path d="M24 22V26L26 28" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const UnlockIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="8" y="8" width="32" height="32" rx="3" fill="#2563eb" opacity="0.2"/>
    <path d="M24 20L24 14C24 10 27 8 30 8C33 8 36 10 36 14" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <rect x="12" y="20" width="24" height="20" rx="2" fill="#2563eb" opacity="0.8"/>
    <circle cx="24" cy="30" r="4" fill="white"/>
    <path d="M24 28V30L25 31" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const OrganizeIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="8" y="8" width="14" height="18" rx="2" fill="#ea580c" opacity="0.8"/>
    <rect x="26" y="8" width="14" height="18" rx="2" fill="#ea580c" opacity="0.6"/>
    <rect x="8" y="30" width="14" height="10" rx="2" fill="#ea580c" opacity="0.6"/>
    <rect x="26" y="30" width="14" height="10" rx="2" fill="#ea580c" opacity="0.8"/>
    <path d="M17 17H13M17 21H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M35 17H29M35 21H29" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const LogoIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <rect x="2" y="4" width="12" height="16" rx="2" fill="#dc2626"/>
    <rect x="14" y="4" width="12" height="16" rx="2" fill="#ef4444"/>
    <path d="M8 26L16 20L24 26" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="20" r="3" fill="#dc2626"/>
  </svg>
);

export const getToolIcon = (iconName: string, size?: number): React.ReactNode => {
  const props = { size };
  switch (iconName) {
    case 'Merge': return <MergeIcon {...props} />;
    case 'Split': return <SplitIcon {...props} />;
    case 'Compress': return <CompressIcon {...props} />;
    case 'ImageToPdf': return <ImageToPdfIcon {...props} />;
    case 'PdfToImage': return <PdfToImageIcon {...props} />;
    case 'WordToPdf': return <WordToPdfIcon {...props} />;
    case 'PdfToWord': return <PdfToWordIcon {...props} />;
    case 'PptToPdf': return <PptToPdfIcon {...props} />;
    case 'PdfToPpt': return <PdfToPptIcon {...props} />;
    case 'ExcelToPdf': return <ExcelToPdfIcon {...props} />;
    case 'PdfToExcel': return <PdfToExcelIcon {...props} />;
    case 'HtmlToPdf': return <HtmlToPdfIcon {...props} />;
    case 'PdfToHtml': return <PdfToHtmlIcon {...props} />;
    case 'Edit': return <EditIcon {...props} />;
    case 'Rotate': return <RotateIcon {...props} />;
    case 'Watermark': return <WatermarkIcon {...props} />;
    case 'PageNumbers': return <PageNumbersIcon {...props} />;
    case 'Crop': return <CropIcon {...props} />;
    case 'Protect': return <ProtectIcon {...props} />;
    case 'Unlock': return <UnlockIcon {...props} />;
    case 'Organize': return <OrganizeIcon {...props} />;
    default: return <EditIcon {...props} />;
  }
};
