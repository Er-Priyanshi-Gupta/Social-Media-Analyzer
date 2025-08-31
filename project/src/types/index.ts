export interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  extractedText?: string;
  analysis?: ContentAnalysis;
  error?: string;
}

export interface ContentAnalysis {
  wordCount: number;
  sentenceCount: number;
  readabilityScore: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  engagement: {
    score: number;
    level: 'low' | 'medium' | 'high';
  };
  suggestions: Suggestion[];
  hashtags: string[];
  mentions: string[];
}

export interface Suggestion {
  id: string;
  type: 'engagement' | 'readability' | 'hashtags' | 'timing' | 'format';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
}