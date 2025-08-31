import React from 'react';
import { 
  TrendingUp, 
  MessageCircle, 
  Hash, 
  AtSign, 
  Target, 
  BookOpen, 
  Heart,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ContentAnalysis } from '../types';

interface AnalysisResultsProps {
  analysis: ContentAnalysis;
  fileName: string;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, fileName }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-pink-600" />
          <span>Analysis Results for "{fileName}"</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <BookOpen className="w-4 h-4 text-pink-600" />
              <span className="text-sm font-medium text-pink-800">Words</span>
            </div>
            <p className="text-2xl font-bold text-pink-900">{analysis.wordCount}</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Sentences</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{analysis.sentenceCount}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Readability</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{analysis.readabilityScore.toFixed(0)}/100</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Heart className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Engagement</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{analysis.engagement.score.toFixed(0)}/100</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Sentiment</label>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(analysis.sentiment)}`}>
              {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
            </span>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Engagement Potential</label>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEngagementColor(analysis.engagement.level)}`}>
              {analysis.engagement.level.charAt(0).toUpperCase() + analysis.engagement.level.slice(1)}
            </span>
          </div>
        </div>
        
        {(analysis.hashtags.length > 0 || analysis.mentions.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {analysis.hashtags.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Hash className="w-4 h-4 text-pink-600" />
                  <span className="text-sm font-medium text-gray-700">Hashtags Found</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.hashtags.map((tag, index) => (
                    <span key={index} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {analysis.mentions.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AtSign className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Mentions Found</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.mentions.map((mention, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {mention}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {analysis.suggestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Improvement Suggestions
          </h3>
          
          <div className="space-y-4">
            {analysis.suggestions.map((suggestion) => (
              <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  {getPriorityIcon(suggestion.priority)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                        suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {suggestion.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{suggestion.description}</p>
                    <p className="text-sm text-pink-600 font-medium">{suggestion.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};