import { useState, useCallback } from 'react';
import type { FileWithPreview, ConversionOptions, ToolStep } from '@/types';

export function useFileConversion() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [step, setStep] = useState<ToolStep>('upload');
  const [options, setOptions] = useState<ConversionOptions>({});
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [resultFilename, setResultFilename] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const addFiles = useCallback((newFiles: File[]) => {
    const filesWithPreview: FileWithPreview[] = newFiles.map((file, index) => ({
      file,
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
    }));
    setFiles(prev => [...prev, ...filesWithPreview]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const reorderFiles = useCallback((newOrder: FileWithPreview[]) => {
    setFiles(newOrder);
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setResult(null);
    setResultUrl('');
    setResultFilename('');
    setProgress(0);
    setError('');
  }, []);

  const updateOptions = useCallback((newOptions: Partial<ConversionOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  const goToStep = useCallback((newStep: ToolStep) => {
    setStep(newStep);
  }, []);

  const setProcessingResult = useCallback((blob: Blob, filename: string) => {
    setResult(blob);
    setResultUrl(URL.createObjectURL(blob));
    setResultFilename(filename);
    setStep('success');
  }, []);

  const setProcessingError = useCallback((err: string) => {
    setError(err);
    setStep('upload');
  }, []);

  return {
    files,
    step,
    options,
    result,
    resultUrl,
    resultFilename,
    progress,
    error,
    addFiles,
    removeFile,
    reorderFiles,
    clearFiles,
    updateOptions,
    goToStep,
    setProgress,
    setProcessingResult,
    setProcessingError,
  };
}
