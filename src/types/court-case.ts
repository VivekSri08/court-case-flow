export interface CourtOrder {
  id: string;
  caseNumber: string;
  orderDate: Date;
  uploadDate: Date;
  fileName: string;
  fileUrl: string;
  courtOrderFileUrl?: string;
  courtOrderFileName?: string;
  caseStatusFileUrl?: string;
  caseStatusFileName?: string;
  thumbnail?: string;
  summary: string;
  actionRequired: string;
  deadline?: Date;
  status: 'pending' | 'in-progress' | 'completed';
  completionDate?: Date;
  completionDocumentUrl?: string;
}

export interface CourtCase {
  id: string;
  caseNumber: string;
  petitioner: string;
  respondent: string;
  courtName: string;
  latestOrderDate: Date;
  nextHearingDate?: Date;
  orders: CourtOrder[];
  urgency: 'urgent' | 'warning' | 'normal';
}

export interface DashboardData {
  cases: CourtCase[];
  totalCases: number;
  pendingOrders: number;
  completedOrders: number;
  urgentCases: number;
}