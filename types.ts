
// types.ts

export enum Urgency {
  LOW = 'נמוכה',
  MEDIUM = 'בינונית',
  HIGH = 'גבוהה',
  CRITICAL = 'קריטית'
}

export interface AIAnalysis {
  category: string;
  urgency: Urgency;
  summary: string;
  visualFindings: string;
}

export interface Complaint {
  id: string;
  productName: string;
  productCode: string;
  customerNumber?: string;
  description: string;
  date: string;
  image: string;
  status: 'נשלח' | 'בטיפול' | 'בוצע';
  reporterName?: string;
  aiAnalysis?: AIAnalysis;
  targetEmail?: string;
  reporterEmail?: string;
}
