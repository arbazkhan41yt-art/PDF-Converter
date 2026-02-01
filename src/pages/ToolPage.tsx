import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getToolByRoute } from '@/data/tools';
import { useFileConversion } from '@/hooks/useFileConversion';
import { getToolIcon } from '@/components/icons/ToolIcons';
import UploadStep from '@/components/tools/UploadStep';
import OptionsStep from '@/components/tools/OptionsSteps';
import ProcessingStep from '@/components/tools/ProcessingStep';
import SuccessStep from '@/components/tools/SuccessStep';
import { 
  createPDFFromImages, 
  mergePDFs, 
  splitPDF, 
  compressPDF, 
  rotatePDF, 
  addWatermarkToPDF,
  addPageNumbersToPDF,
  pdfToImages 
} from '@/lib/pdfUtils';
import {
  convertWordToPDF,
  convertPDFToWord,
  convertExcelToPDF,
  convertPDFToExcel,
  convertPowerPointToPDF,
  convertPDFToPowerPoint,
  convertPDFToHTML
} from '@/lib/fileConverters';
import JSZip from 'jszip';

const ToolPage = () => {
  const { toolRoute } = useParams<{ toolRoute: string }>();
  const tool = getToolByRoute(`/${toolRoute}`);
  
  const {
    files,
    step,
    options,
    resultUrl,
    resultFilename,
    progress,
    addFiles,
    removeFile,
    clearFiles,
    updateOptions,
    goToStep,
    setProgress,
    setProcessingResult,
    setProcessingError,
  } = useFileConversion();

  useEffect(() => {
    clearFiles();
    goToStep('upload');
  }, [toolRoute]);

  if (!tool) {
    return <Navigate to="/" />;
  }

  const getAcceptedTypes = () => {
    switch (tool.id) {
      case 'jpg-to-pdf':
      case 'pdf-to-jpg':
        return 'image/*';
      case 'word-to-pdf':
      case 'pdf-to-word':
        return '.doc,.docx,.txt';
      case 'excel-to-pdf':
      case 'pdf-to-excel':
        return '.xls,.xlsx,.csv';
      case 'powerpoint-to-pdf':
      case 'pdf-to-powerpoint':
        return '.ppt,.pptx';
      case 'html-to-pdf':
      case 'pdf-to-html':
        return '.html,.htm';
      default:
        return '.pdf';
    }
  };

  const getMultiple = () => {
    return ['merge-pdf', 'jpg-to-pdf'].includes(tool.id);
  };

  const processFiles = async () => {
    goToStep('processing');
    setProgress(0);

    try {
      let result: Blob;
      let filename: string;

      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 10, 90));
      }, 200);

      switch (tool.id) {
        case 'jpg-to-pdf':
          result = await createPDFFromImages(files, options);
          filename = 'converted.pdf';
          break;
        
        case 'merge-pdf':
          result = await mergePDFs(files);
          filename = 'merged.pdf';
          break;
        
        case 'split-pdf':
          if (files.length > 0) {
            result = await splitPDF(files[0], '1');
            filename = 'split.pdf';
          }
          break;
        
        case 'compress-pdf':
          if (files.length > 0) {
            result = await compressPDF(files[0], options.quality || 'medium');
            filename = 'compressed.pdf';
          }
          break;
        
        case 'rotate-pdf':
          if (files.length > 0) {
            result = await rotatePDF(files[0], options.rotate || 90);
            filename = 'rotated.pdf';
          }
          break;
        
        case 'add-watermark':
          if (files.length > 0 && options.watermark?.text) {
            result = await addWatermarkToPDF(files[0], options.watermark.text, options);
            filename = 'watermarked.pdf';
          }
          break;
        
        case 'add-page-numbers':
          if (files.length > 0) {
            result = await addPageNumbersToPDF(files[0], options);
            filename = 'numbered.pdf';
          }
          break;
        
        case 'pdf-to-jpg':
          if (files.length > 0) {
            const images = await pdfToImages(files[0], 'jpg');
            if (images.length === 1) {
              result = images[0];
              filename = 'page-1.jpg';
            } else {
              const zip = new JSZip();
              images.forEach((img, i) => {
                zip.file(`page-${i + 1}.jpg`, img);
              });
              result = await zip.generateAsync({ type: 'blob' });
              filename = 'pages.zip';
            }
          }
          break;
        
        case 'word-to-pdf':
          if (files.length > 0) {
            result = await convertWordToPDF(files[0]);
            filename = 'converted.pdf';
          }
          break;
        
        case 'pdf-to-word':
          if (files.length > 0) {
            result = await convertPDFToWord(files[0]);
            filename = 'converted.doc';
          }
          break;
        
        case 'excel-to-pdf':
          if (files.length > 0) {
            result = await convertExcelToPDF(files[0]);
            filename = 'converted.pdf';
          }
          break;
        
        case 'pdf-to-excel':
          if (files.length > 0) {
            result = await convertPDFToExcel(files[0]);
            filename = 'converted.xlsx';
          }
          break;
        
        case 'powerpoint-to-pdf':
          if (files.length > 0) {
            result = await convertPowerPointToPDF(files[0]);
            filename = 'converted.pdf';
          }
          break;
        
        case 'pdf-to-powerpoint':
          if (files.length > 0) {
            result = await convertPDFToPowerPoint(files[0]);
            filename = 'converted.pptx';
          }
          break;
        
        case 'pdf-to-html':
          if (files.length > 0) {
            result = await convertPDFToHTML(files[0]);
            filename = 'converted.html';
          }
          break;
        
        default:
          if (files.length > 0) {
            result = files[0].file;
            filename = files[0].name;
          }
      }

      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setProcessingResult(result!, filename!);
      }, 500);

    } catch (error) {
      console.error('Processing error:', error);
      setProcessingError('An error occurred while processing your files. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tool Header */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            {getToolIcon(tool.icon, 64)}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {tool.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Tool Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {step === 'upload' && (
          <UploadStep
            files={files}
            onFilesAdded={addFiles}
            onRemoveFile={removeFile}
            onContinue={() => goToStep('options')}
            acceptedTypes={getAcceptedTypes()}
            multiple={getMultiple()}
          />
        )}

        {step === 'options' && (
          <OptionsStep
            toolId={tool.id}
            options={options}
            onOptionsChange={updateOptions}
            onBack={() => goToStep('upload')}
            onProcess={processFiles}
          />
        )}

        {step === 'processing' && (
          <ProcessingStep progress={progress} />
        )}

        {step === 'success' && (
          <SuccessStep
            resultUrl={resultUrl}
            resultFilename={resultFilename}
            onReset={clearFiles}
            toolRoute={tool.route}
          />
        )}
      </div>
    </div>
  );
};

export default ToolPage;
