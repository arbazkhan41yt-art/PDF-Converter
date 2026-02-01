import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingStepProps {
  progress: number;
  message?: string;
}

const ProcessingStep: React.FC<ProcessingStepProps> = ({ 
  progress, 
  message = 'Processing your files...' 
}) => {
  return (
    <div className="w-full max-w-md mx-auto text-center py-12">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
        <div 
          className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"
          style={{ transform: `rotate(${progress * 3.6}deg)` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {message}
      </h3>
      <p className="text-gray-500 mb-4">
        Please wait while we process your files
      </p>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-red-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-gray-600">
        {progress}%
      </p>
    </div>
  );
};

export default ProcessingStep;
