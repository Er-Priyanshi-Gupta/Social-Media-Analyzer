import { ContentAnalysis, Suggestion } from '../types';

export class ContentAnalyzer {
  static analyzeContent(text: string): ContentAnalysis {
    const words = this.getWords(text);
    const sentences = this.getSentences(text);
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    
    const readabilityScore = this.calculateReadability(words, sentences);
    const sentiment = this.analyzeSentiment(text);
    const engagement = this.calculateEngagement(text, words);
    const hashtags = this.extractHashtags(text);
    const mentions = this.extractMentions(text);
    const suggestions = this.generateSuggestions(text, words, sentences, engagement.score);

    return {
      wordCount,
      sentenceCount,
      readabilityScore,
      sentiment,
      engagement,
      suggestions,
      hashtags,
      mentions
    };
  }

  private static getWords(text: string): string[] {
    return text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  }

  private static getSentences(text: string): string[] {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }

  private static calculateReadability(words: string[], sentences: string[]): number {
    if (sentences.length === 0) return 0;
    const avgWordsPerSentence = words.length / sentences.length;
    const complexWords = words.filter(word => word.length > 6).length;
    const complexWordRatio = complexWords / words.length;
    
    return Math.max(0, Math.min(100, 100 - (avgWordsPerSentence * 2) - (complexWordRatio * 50)));
  }

  private static analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['amazing', 'awesome', 'fantastic', 'great', 'excellent', 'love', 'wonderful', 'perfect', 'best', 'incredible'];
    const negativeWords = ['terrible', 'awful', 'horrible', 'worst', 'hate', 'bad', 'disappointing', 'failed', 'broken', 'useless'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private static calculateEngagement(text: string, words: string[]): { score: number; level: 'low' | 'medium' | 'high' } {
    let score = 50;
    
    const questionMarks = (text.match(/\?/g) || []).length;
    score += questionMarks * 10;
    
    const emojiPattern = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    const emojis = (text.match(emojiPattern) || []).length;
    score += emojis * 5;
    
    const ctaWords = ['comment', 'share', 'like', 'follow', 'subscribe', 'click', 'join', 'download', 'try'];
    const ctaCount = words.filter(word => ctaWords.includes(word)).length;
    score += ctaCount * 15;
    
    if (words.length >= 100 && words.length <= 250) {
      score += 20;
    } else if (words.length > 250) {
      score -= 10;
    }
    
    score = Math.max(0, Math.min(100, score));
    
    let level: 'low' | 'medium' | 'high';
    if (score >= 70) level = 'high';
    else if (score >= 40) level = 'medium';
    else level = 'low';
    
    return { score, level };
  }

  private static extractHashtags(text: string): string[] {
    const hashtags = text.match(/#[a-zA-Z0-9_]+/g) || [];
    return [...new Set(hashtags)];
  }

  private static extractMentions(text: string): string[] {
    const mentions = text.match(/@[a-zA-Z0-9_]+/g) || [];
    return [...new Set(mentions)];
  }

  private static generateSuggestions(text: string, words: string[], sentences: string[], engagementScore: number): Suggestion[] {
    const suggestions: Suggestion[] = [];
    
    if (words.length < 50) {
      suggestions.push({
        id: 'word-count-low',
        type: 'engagement',
        priority: 'high',
        title: 'Expand your content',
        description: 'Your post is quite short. Consider adding more context or details to increase engagement.',
        impact: 'Could increase engagement by 25-40%'
      });
    } else if (words.length > 300) {
      suggestions.push({
        id: 'word-count-high',
        type: 'readability',
        priority: 'medium',
        title: 'Consider shortening your content',
        description: 'Long posts can lose reader attention. Try breaking it into multiple posts or summarizing key points.',
        impact: 'Could improve readability by 20-30%'
      });
    }
    
    const questionMarks = (text.match(/\?/g) || []).length;
    if (questionMarks === 0) {
      suggestions.push({
        id: 'add-questions',
        type: 'engagement',
        priority: 'high',
        title: 'Add engaging questions',
        description: 'Posts with questions get 3x more comments. Try asking your audience about their experiences or opinions.',
        impact: 'Could increase comments by 200-300%'
      });
    }
    
    const hashtags = this.extractHashtags(text);
    if (hashtags.length === 0) {
      suggestions.push({
        id: 'add-hashtags',
        type: 'hashtags',
        priority: 'medium',
        title: 'Include relevant hashtags',
        description: 'Hashtags help your content reach a wider audience. Add 3-5 relevant hashtags to increase discoverability.',
        impact: 'Could increase reach by 50-70%'
      });
    } else if (hashtags.length > 10) {
      suggestions.push({
        id: 'reduce-hashtags',
        type: 'hashtags',
        priority: 'low',
        title: 'Consider reducing hashtags',
        description: 'Too many hashtags can appear spammy. Stick to 3-5 highly relevant hashtags for better results.',
        impact: 'Could improve credibility and engagement quality'
      });
    }
    
    const ctaWords = ['comment', 'share', 'like', 'follow', 'subscribe', 'click', 'join', 'download', 'try'];
    const hasCTA = words.some(word => ctaWords.includes(word));
    if (!hasCTA) {
      suggestions.push({
        id: 'add-cta',
        type: 'engagement',
        priority: 'high',
        title: 'Include a clear call-to-action',
        description: 'End your post with a specific action you want readers to take, like "What do you think?" or "Share your experience below!"',
        impact: 'Could increase engagement by 40-60%'
      });
    }
    
    if (engagementScore < 40) {
      suggestions.push({
        id: 'engagement-boost',
        type: 'engagement',
        priority: 'high',
        title: 'Boost engagement potential',
        description: 'Your content could be more engaging. Try adding personal stories, asking questions, or using more conversational language.',
        impact: 'Could double your engagement rate'
      });
    }
    
    return suggestions;
  }
}
