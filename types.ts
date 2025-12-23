
export enum Urgency {
  LOW = 'נמוכה',
  MEDIUM = 'בינונית',
  HIGH = 'גבוהה',
  CRITICAL = 'קריטית'
}

export interface Complaint {
  id: string;
  productName: string;
  productCode: string;
  description: string;
  date: string;
  reporterEmail: string;
  targetEmail: string;
  status: 'נשלח' | 'טיוטה' | 'בטיפול';
  image?: string; // Base64 image data
  aiAnalysis?: {
    category: string;
    urgency: Urgency;
    summary: string;
    visualFindings?: string;
  };
}

export interface FormData {
  productName: string;
  productCode: string;
  description: string;
  targetEmail: string;
  reporterEmail: string;
  image?: string;
}
