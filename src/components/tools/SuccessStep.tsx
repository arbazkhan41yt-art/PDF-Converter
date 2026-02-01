import { Link } from 'react-router-dom';
import { Download, CheckCircle, File, RotateCcw, ArrowRight, Shield, Lock, Clock } from 'lucide-react';
import { tools } from '@/data/tools';
import { formatFileSize } from '@/lib/pdfUtils';

interface SuccessStepProps {
  resultUrl: string;
  resultFilename: string;
  resultSize?: number;
  onReset: () => void;
  toolRoute: string;
}

const SuccessStep = ({
  resultUrl,
  resultFilename,
  resultSize,
  onReset,
  toolRoute,
}: SuccessStepProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = resultFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const relatedTools = tools
    .filter(t => t.route !== toolRoute)
    .slice(0, 4);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          File Ready!
        </h2>
        <p className="text-gray-500">
          Your file has been processed successfully
        </p>
      </div>

      {/* File Info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
            <File className="w-7 h-7 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-gray-900 truncate">
              {resultFilename}
            </p>
            {resultSize && (
              <p className="text-sm text-gray-500">
                {formatFileSize(resultSize)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="w-full btn-primary flex items-center justify-center space-x-2 px-6 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 mb-4"
      >
        <Download className="w-5 h-5" />
        <span>Download File</span>
      </button>

      {/* Start Over */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
      >
        <RotateCcw className="w-5 h-5" />
        <span>Start Over</span>
      </button>

      {/* Security Badges */}
      <div className="flex items-center justify-center space-x-6 mt-8 py-6 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Shield className="w-5 h-5 text-green-600" />
          <span>Secure Processing</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Lock className="w-5 h-5 text-blue-600" />
          <span>Files Deleted</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-5 h-5 text-orange-600" />
          <span>Auto Delete</span>
        </div>
      </div>

      {/* Continue With Related Tools */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Continue with other tools
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {relatedTools.map(tool => (
            <Link
              key={tool.id}
              to={tool.route}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-red-300 hover:shadow-sm transition-all"
            >
              <span className="font-medium text-gray-900">{tool.name}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessStep;
