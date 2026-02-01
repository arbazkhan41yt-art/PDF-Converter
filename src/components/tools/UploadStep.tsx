import { useCallback, useRef, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import type { FileWithPreview } from '@/types';
import { formatFileSize } from '@/lib/pdfUtils';

interface UploadStepProps {
  files: FileWithPreview[];
  onFilesAdded: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  onContinue: () => void;
  acceptedTypes?: string;
  multiple?: boolean;
  maxFiles?: number;
}

const UploadStep = ({
  files,
  onFilesAdded,
  onRemoveFile,
  onContinue,
  acceptedTypes = '*',
  multiple = true,
  maxFiles = 10,
}: UploadStepProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = multiple 
      ? droppedFiles.slice(0, maxFiles - files.length)
      : [droppedFiles[0]];
    
    if (validFiles.length > 0) {
      onFilesAdded(validFiles);
    }
  }, [files.length, maxFiles, multiple, onFilesAdded]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      onFilesAdded(selectedFiles);
    }
  }, [onFilesAdded]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Upload Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          upload-zone relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 hover:border-red-400 bg-white'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-red-600" />
          </div>
          
          <button
            type="button"
            className="btn-primary px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
          >
            Select {acceptedTypes.includes('image') ? 'Images' : 'Files'}
          </button>
          
          <p className="mt-3 text-gray-500">
            or drop files here
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 animate-fadeIn">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Selected Files ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <File className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={onContinue}
            className="w-full mt-4 btn-primary px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadStep;
