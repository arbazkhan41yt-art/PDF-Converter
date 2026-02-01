export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  color: string;
  bgColor: string;
  route: string;
}

export interface FileWithPreview {
  file: File;
  id: string;
  preview?: string;
  name: string;
  size: number;
  type: string;
  progress?: number;
}

export type ToolStep = 'upload' | 'options' | 'processing' | 'success';

export interface ConversionOptions {
  orientation?: 'portrait' | 'landscape';
  margin?: 'none' | 'small' | 'medium' | 'large';
  quality?: 'low' | 'medium' | 'high';
  pageSize?: 'a4' | 'letter' | 'legal';
  password?: string;
  watermark?: {
    text?: string;
    image?: string;
    opacity?: number;
    position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
  rotate?: 0 | 90 | 180 | 270;
  pageNumbers?: {
    enabled?: boolean;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    startNumber?: number;
  };
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const TOOL_CATEGORIES = {
  ALL: 'All',
  WORKFLOWS: 'Workflows',
  ORGANIZE: 'Organize PDF',
  OPTIMIZE: 'Optimize PDF',
  CONVERT: 'Convert PDF',
  EDIT: 'Edit PDF',
  SECURITY: 'PDF Security',
} as const;

export type ToolCategory = typeof TOOL_CATEGORIES[keyof typeof TOOL_CATEGORIES];
