export interface User {
  id: string;
  name: string;
  email: string;
  level: string;
  points: number;
  badges: Badge[];
  digitalHealthScore: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ScanResult {
  id: string;
  type: 'url' | 'email' | 'text';
  content: string;
  verdict: 'safe' | 'suspicious' | 'dangerous';
  confidence: number;
  explanation: string;
  scannedAt: Date;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: Date;
  credibilityScore: number;
  credibilityReason: string;
  imageUrl?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface EducationalContent {
  id: string;
  title: string;
  category: string;
  type: 'article' | 'video' | 'infographic';
  content: string;
  thumbnail?: string;
  readTime: number;
}

export interface BreachResult {
  email: string;
  breaches: Array<{
    name: string;
    date: string;
    compromisedData: string[];
  }>;
  totalBreaches: number;
}