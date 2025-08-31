import React from 'react';
import { BarChart3, Sparkles, Github } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 poppins-text py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-2 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Social Analyzer
              </h1>
              <p className="text-xs text-gray-600 font-medium">Content optimization made simple</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-2 rounded-full border border-pink-100">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span className="text-sm font-semibold text-pink-700">AI-Powered</span>
            </div>

            <a
              href="https://github.com/Er-Priyanshi-Gupta"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};