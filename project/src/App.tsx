import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { FileStatus } from './components/FileStatus';
import { AnalysisResults } from './components/AnalysisResults';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { TextExtractionEngine } from './utils/textExtraction';
import { ContentAnalyzer } from './utils/contentAnalysis';
import { UploadedFile } from './types';
import { FileText, Sparkles, ArrowRight, Target, Zap, BarChart, TrendingUp } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedAnalyses, setCompletedAnalyses] = useState<UploadedFile[]>([]);

  useEffect(() => {
    return () => {
      TextExtractionEngine.cleanup();
    };
  }, []);

  const handleFilesAdded = async (newFiles: UploadedFile[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setIsProcessing(true);

    try {
      for (const file of newFiles) {
        setFiles(prev => prev.map(f =>
          f.id === file.id ? { ...f, status: 'processing', progress: 25 } : f
        ));

        try {
          const extractedText = await TextExtractionEngine.extractText(file.file);

          setFiles(prev => prev.map(f =>
            f.id === file.id ? { ...f, progress: 75 } : f
          ));

          const analysis = ContentAnalyzer.analyzeContent(extractedText);

          const completedFile = {
            ...file,
            status: 'completed' as const,
            progress: 100,
            extractedText,
            analysis
          };

          setFiles(prev => prev.map(f =>
            f.id === file.id ? completedFile : f
          ));

          setCompletedAnalyses(prev => [...prev, completedFile]);
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          setFiles(prev => prev.map(f =>
            f.id === file.id ? {
              ...f,
              status: 'error',
              error: (error as Error).message
            } : f
          ));
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setCompletedAnalyses([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-3 rounded-full text-sm font-medium mb-6 shadow-lg poppins-text">
            <Sparkles className="w-4 h-4" />
            <span className='poppins-text'>AI-Powered Content Analysis</span>
          </div>

          <h1 className="text-5xl leading-snug font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent poppins-text">
            Transform Your Content Into Engagement
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Upload documents or images to extract text and receive intelligent suggestions
            for improving engagement, readability, and social media performance.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <FileUpload onFilesAdded={handleFilesAdded} isProcessing={isProcessing} />
          </div>
        </div>

        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-darkpink transition-all duration-300 flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Instant Analysis</h3>
                <p className="text-gray-600">Get results in seconds</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-darkpink transition-all duration-300 flex items-center">
              <div className="bg-pink-100 p-3 rounded-lg mr-4">
                <BarChart className="w-8 h-8 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Deep Insights</h3>
                <p className="text-gray-600">Comprehensive metrics</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-darkpink transition-all duration-300 flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Boost Engagement</h3>
                <p className="text-gray-600">Actionable recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <FileStatus files={files} />

              {files.some(f => f.status === 'completed' || f.status === 'error') && (
                <div className="mt-6 text-center">
                  <button
                    onClick={clearFiles}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    Clear all files
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {completedAnalyses.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-3 rounded-full text-sm font-medium mb-4 shadow-lg">
                <FileText className="w-5 h-5" />
                <ArrowRight className="w-4 h-4" />
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete</h2>
              <p className="text-gray-600 text-lg">Your content optimization insights are ready</p>
            </div>

            {isProcessing && files.some(f => f.status === 'processing') && (
              <LoadingSkeleton />
            )}

            {completedAnalyses.map((file) => (
              file.analysis && (
                <div key={file.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <AnalysisResults
                    analysis={file.analysis}
                    fileName={file.name}
                  />
                </div>
              )
            ))}
          </div>
        )}

        {files.length === 0 && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                How It Works
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-pink-md transition-all duration-300 group text-center">
                  <div className="relative mb-5">
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:shadow-pink-sm">
                      <FileText className="w-10 h-10 text-pink-600" />
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-pink-100 to-pink-200 rounded-2xl opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300 -z-10"></div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">1. Upload Content</h3>
                  <p className="text-gray-600">
                    Drop your PDF documents or images containing text that you want to analyze for social media.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-pink-md transition-all duration-300 group text-center">
                  <div className="relative mb-5">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:shadow-pink-sm">
                      <Target className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-pink-100 to-pink-200 rounded-2xl opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300 -z-10"></div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">2. AI Analysis</h3>
                  <p className="text-gray-600">
                    Our AI engine extracts text and analyzes it for engagement potential, readability, and sentiment.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-pink-md transition-all duration-300 group text-center">
                  <div className="relative mb-5">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:shadow-pink-sm">
                      <Sparkles className="w-10 h-10 text-green-600" />
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-pink-100 to-pink-200 rounded-2xl opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300 -z-10"></div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">3. Get Insights</h3>
                  <p className="text-gray-600">
                    Receive actionable suggestions to optimize your content for maximum social media engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20 poppins-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center text-gray-700">
            <p className="mb-2 poppins-text">
              This project is made by Priyanshi Gupta from PSIT Kanpur as an assignment for Unthinkable Solutions – Daffodils.
            </p>
            <p className='poppins-text'>
              © 2025 Priyanshi Gupta. All rights reserved. | Portfolio:{" "}
              <a
                href="https://www.spriyanshi.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700 transition-colors font-bold poppins-text"
              >
                www.spriyanshi.dev
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;