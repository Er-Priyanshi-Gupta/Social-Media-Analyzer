import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, AlertCircle, CheckCircle2, Cloud, FileText, Image, FileType, X } from 'lucide-react';
import { UploadedFile } from '../types';

interface FileUploadProps {
  onFilesAdded: (files: UploadedFile[]) => void;
  isProcessing: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/tiff': ['.tiff', '.tif']
};

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesAdded, isProcessing }) => {
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setUploadErrors([]);

    const errors: string[] = [];
    rejectedFiles.forEach((rejected) => {
      rejected.errors.forEach((error: any) => {
        if (error.code === 'file-too-large') {
          errors.push(`${rejected.file.name}: File size exceeds 10MB limit`);
        } else if (error.code === 'file-invalid-type') {
          errors.push(`${rejected.file.name}: Unsupported file type`);
        }
      });
    });

    if (errors.length > 0) {
      setUploadErrors(errors);
    }

    if (acceptedFiles.length > 0) {
      const uploadedFiles: UploadedFile[] = acceptedFiles.map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      }));

      onFilesAdded(uploadedFiles);
    }
  }, [onFilesAdded]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    disabled: isProcessing
  });

  const getDropzoneStyles = () => {
    if (isDragAccept) return 'border-pink-500 bg-gradient-to-br from-pink-50 to-pink-100 shadow-lg scale-[1.02]';
    if (isDragReject) return 'border-red-500 bg-gradient-to-br from-red-50 to-red-100';
    if (isDragActive) return 'border-pink-400 bg-gradient-to-br from-pink-25 to-pink-50 shadow-md';
    return 'border-gray-300 hover:border-pink-400 hover:bg-gray-50';
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes('image')) return <Image className="w-5 h-5 text-blue-500" />;
    return <FileType className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6 ">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 poppins-text">Upload Your Content</h2>
        <p className="text-gray-600 poppins-text">Get AI-powered insights for your documents and images</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer
            ${getDropzoneStyles()}
            ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />

          <div className="text-center">
            <div className="mx-auto mb-5 flex justify-center">
              <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-4 rounded-full">
                {isDragActive ? (
                  <Upload className="w-8 h-8 text-white animate-pulse" />
                ) : (
                  <Cloud className="w-8 h-8 text-white" />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xl font-semibold text-gray-900">
                {isDragActive
                  ? 'Drop your files here'
                  : 'Drag & drop files here'
                }
              </p>
              <p className="text-gray-500 poppins-text">
                or <span className="text-pink-600 font-medium poppins-text">browse files</span> from your computer
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-600 poppins-text">
                <FileText className="w-4 h-4 mr-1.5 text-red-500" />
                PDF
              </div>
              <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-600 poppins-text">
                <Image className="w-4 h-4 mr-1.5 text-blue-500" />
                JPG/PNG
              </div>
              <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-600 poppins-text">
                <FileType className="w-4 h-4 mr-1.5 text-purple-500" />
                TIFF
              </div>
              <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-600 poppins-text">
                <span className="mr-1.5">📏</span>
                Up to 10MB
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl backdrop-blur-sm">
              <div className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-pink-100 rounded-full mx-auto mb-4"></div>
                  <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                </div>
                <p className="text-lg font-medium text-gray-800 poppins-text">Processing files...</p>
                <p className="text-sm text-gray-600 mt-1 poppins-text">This may take a few moments</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 mb-6">
        <div className="flex items-start">
          <div className="bg-blue-100 p-2 rounded-lg mr-4 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1 poppins-text">What happens next?</h3>
            <p className="text-sm text-gray-700 poppins-text">
              Our AI will analyze your content and provide insights on readability, engagement potential,
              and optimization suggestions for social media.
            </p>
          </div>
        </div>
      </div>

      {uploadErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
          <div className="flex items-center mb-3">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="font-semibold text-red-800 poppins-text">Upload Issues</h3>
          </div>
          <div className="space-y-2">
            {uploadErrors.map((error, index) => (
              <div key={index} className="flex items-start text-red-700 text-sm">
                <span className="mr-2">•</span>
                <span>{error}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};