import { ArrowLeft, ArrowRight, Settings, RotateCw } from 'lucide-react';
import type { ConversionOptions } from '@/types';

interface OptionsStepProps {
  toolId: string;
  options: ConversionOptions;
  onOptionsChange: (options: Partial<ConversionOptions>) => void;
  onBack: () => void;
  onProcess: () => void;
}

const OptionsStep = ({
  toolId,
  options,
  onOptionsChange,
  onBack,
  onProcess,
}: OptionsStepProps) => {
  const renderOptions = () => {
    switch (toolId) {
      case 'jpg-to-pdf':
        return <JPGToPDFOptions options={options} onChange={onOptionsChange} />;
      case 'merge-pdf':
        return <MergePDFOptions />;
      case 'split-pdf':
        return <SplitPDFOptions />;
      case 'compress-pdf':
        return <CompressPDFOptions options={options} onChange={onOptionsChange} />;
      case 'rotate-pdf':
        return <RotatePDFOptions options={options} onChange={onOptionsChange} />;
      case 'add-watermark':
        return <WatermarkOptions options={options} onChange={onOptionsChange} />;
      case 'add-page-numbers':
        return <PageNumberOptions options={options} onChange={onOptionsChange} />;
      case 'protect-pdf':
        return <ProtectPDFOptions options={options} onChange={onOptionsChange} />;
      default:
        return <DefaultOptions />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Options</h3>
            <p className="text-sm text-gray-500">Customize your output</p>
          </div>
        </div>

        {renderOptions()}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button
          onClick={onProcess}
          className="flex-1 btn-primary flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700"
        >
          <span>Convert</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Option Components
const JPGToPDFOptions = ({ options, onChange }: { options: ConversionOptions; onChange: (o: Partial<ConversionOptions>) => void }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Page Orientation</label>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onChange({ orientation: 'portrait' })}
          className={`flex items-center justify-center space-x-2 p-4 border rounded-lg ${
            options.orientation !== 'landscape' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span>Portrait</span>
        </button>
        <button
          onClick={() => onChange({ orientation: 'landscape' })}
          className={`flex items-center justify-center space-x-2 p-4 border rounded-lg ${
            options.orientation === 'landscape' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span>Landscape</span>
        </button>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
      <select
        value={options.pageSize || 'a4'}
        onChange={(e) => onChange({ pageSize: e.target.value as any })}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
      >
        <option value="a4">A4</option>
        <option value="letter">Letter</option>
        <option value="legal">Legal</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Margin</label>
      <select
        value={options.margin || 'none'}
        onChange={(e) => onChange({ margin: e.target.value as any })}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
      >
        <option value="none">No Margin</option>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
    </div>
  </div>
);

const MergePDFOptions = () => (
  <div className="space-y-6">
    <div className="p-4 bg-blue-50 rounded-lg">
      <p className="text-sm text-blue-700">
        Files will be merged in the order shown. You can reorder files on the previous step.
      </p>
    </div>
  </div>
);

const SplitPDFOptions = () => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Page Ranges</label>
      <input
        type="text"
        placeholder="e.g., 1-3, 5, 7-10"
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
      <p className="mt-2 text-sm text-gray-500">
        Enter page numbers and/or ranges separated by commas
      </p>
    </div>
  </div>
);

const CompressPDFOptions = ({ options, onChange }: { options: ConversionOptions; onChange: (o: Partial<ConversionOptions>) => void }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Compression Level</label>
      <div className="grid grid-cols-3 gap-3">
        {(['low', 'medium', 'high'] as const).map((level) => (
          <button
            key={level}
            onClick={() => onChange({ quality: level })}
            className={`p-4 border rounded-lg capitalize ${
              options.quality === level ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Higher compression = smaller file size, lower quality
      </p>
    </div>
  </div>
);

const RotatePDFOptions = ({ options, onChange }: { options: ConversionOptions; onChange: (o: Partial<ConversionOptions>) => void }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Rotation</label>
      <div className="grid grid-cols-2 gap-3">
        {[0, 90, 180, 270].map((deg) => (
          <button
            key={deg}
            onClick={() => onChange({ rotate: deg as any })}
            className={`flex items-center justify-center space-x-2 p-4 border rounded-lg ${
              options.rotate === deg ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <RotateCw className="w-5 h-5" style={{ transform: `rotate(${deg}deg)` }} />
            <span>{deg}°</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const WatermarkOptions = ({ options, onChange }: { options: ConversionOptions; onChange: (o: Partial<ConversionOptions>) => void }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Watermark Text</label>
      <input
        type="text"
        value={options.watermark?.text || ''}
        onChange={(e) => onChange({ watermark: { ...options.watermark, text: e.target.value } })}
        placeholder="Enter watermark text"
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Opacity</label>
      <input
        type="range"
        min="0.1"
        max="1"
        step="0.1"
        value={options.watermark?.opacity || 0.3}
        onChange={(e) => onChange({ watermark: { ...options.watermark, opacity: parseFloat(e.target.value) } })}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-gray-500 mt-1">
        <span>Light</span>
        <span>{Math.round((options.watermark?.opacity || 0.3) * 100)}%</span>
        <span>Dark</span>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
      <select
        value={options.watermark?.position || 'center'}
        onChange={(e) => onChange({ watermark: { ...options.watermark, position: e.target.value as any } })}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
      >
        <option value="center">Center</option>
        <option value="top-left">Top Left</option>
        <option value="top-right">Top Right</option>
        <option value="bottom-left">Bottom Left</option>
        <option value="bottom-right">Bottom Right</option>
      </select>
    </div>
  </div>
);

const PageNumberOptions = ({ options, onChange }: { options: ConversionOptions; onChange: (o: Partial<ConversionOptions>) => void }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
      <select
        value={options.pageNumbers?.position || 'bottom-center'}
        onChange={(e) => onChange({ pageNumbers: { ...options.pageNumbers, position: e.target.value as any } })}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
      >
        <option value="top-left">Top Left</option>
        <option value="top-center">Top Center</option>
        <option value="top-right">Top Right</option>
        <option value="bottom-left">Bottom Left</option>
        <option value="bottom-center">Bottom Center</option>
        <option value="bottom-right">Bottom Right</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Start Number</label>
      <input
        type="number"
        min="1"
        value={options.pageNumbers?.startNumber || 1}
        onChange={(e) => onChange({ pageNumbers: { ...options.pageNumbers, startNumber: parseInt(e.target.value) } })}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
    </div>
  </div>
);

const ProtectPDFOptions = ({ options, onChange }: { options: ConversionOptions; onChange: (o: Partial<ConversionOptions>) => void }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
      <input
        type="password"
        value={options.password || ''}
        onChange={(e) => onChange({ password: e.target.value })}
        placeholder="Enter password"
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
    </div>
  </div>
);

const DefaultOptions = () => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <p className="text-sm text-gray-600">
      No additional options available for this tool. Click Convert to proceed.
    </p>
  </div>
);

export default OptionsStep;
