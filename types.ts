
export enum Urgency {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
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
  targetEmail?: string;
  reporterEmail?: string;
  aiAnalysis?: {
    category: string;
    urgency: Urgency;
    summary: string;
    visualFindings: string;
  };
}
