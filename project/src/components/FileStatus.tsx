import React from 'react';
import { FileText, Image, AlertCircle, CheckCircle2, Loader2, File, Clock } from 'lucide-react';
import { UploadedFile } from '../types';

interface FileStatusProps {
  files: UploadedFile[];
}

export const FileStatus: React.FC<FileStatusProps> = ({ files }) => {
  if (files.length === 0) return null;

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    if (type.includes('image')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 text-pink-600 animate-spin" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading': return 'Uploading...';
      case 'processing': return 'Processing...';
      case 'completed': return 'Complete';
      case 'error': return 'Error';
    }
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading': return 'text-pink-600';
      case 'processing': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4 poppins-text">
      <h3 className="text-xl font-semibold text-gray-900 poppins-text flex items-center">
        <Loader2 className="w-5 h-5 text-pink-600 mr-2 animate-spin" />
        Processing Files
      </h3>
      
      <div className="space-y-3">
        {files.map((file) => (
          <div key={file.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="bg-gray-100 p-2 rounded-lg">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate poppins-text">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 poppins-text">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusIcon(file.status)}
                <span className={`text-sm font-medium ${getStatusColor(file.status)} poppins-text`}>
                  {getStatusText(file.status)}
                </span>
              </div>
            </div>
            
            {(file.status === 'uploading' || file.status === 'processing') && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1 poppins-text">
                  <span>Progress</span>
                  <span>{file.progress}%</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {file.status === 'error' && file.error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                <div className="text-sm text-red-700 flex items-start space-x-2 poppins-text">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{file.error}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};