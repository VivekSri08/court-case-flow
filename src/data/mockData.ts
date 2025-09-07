import { CourtCase, DashboardData } from "@/types/court-case";

export const mockCases: CourtCase[] = [
  {
    id: "case_1",
    caseNumber: "WP/12345/2024",
    petitioner: "Ram Singh & Others",
    respondent: "State of Punjab & Others",
    courtName: "Punjab & Haryana High Court",
    latestOrderDate: new Date('2024-01-15'),
    nextHearingDate: new Date('2024-01-18'),
    urgency: 'urgent',
    orders: [
      {
        id: "order_1",
        caseNumber: "WP/12345/2024",
        orderDate: new Date('2024-01-15'),
        uploadDate: new Date('2024-01-15'),
        fileName: "interim_order_15_jan_2024.pdf",
        fileUrl: "/mock-file-1.pdf",
        summary: "Court has directed the state to file a detailed reply regarding land acquisition compensation within 15 days.",
        actionRequired: "Prepare and file detailed reply on land acquisition compensation with supporting documents",
        deadline: new Date('2024-01-30'),
        status: 'pending'
      },
      {
        id: "order_2",
        caseNumber: "WP/12345/2024",
        orderDate: new Date('2024-01-10'),
        uploadDate: new Date('2024-01-10'),
        fileName: "notice_order_10_jan_2024.pdf",
        fileUrl: "/mock-file-2.pdf",
        summary: "Notice issued to all respondents to appear before the court on next hearing date.",
        actionRequired: "Ensure all respondents are properly notified of the hearing date",
        status: 'completed'
      }
    ]
  },
  {
    id: "case_2",
    caseNumber: "CWP/6789/2024",
    petitioner: "Sita Devi",
    respondent: "Municipal Corporation & Others",
    courtName: "Punjab & Haryana High Court",
    latestOrderDate: new Date('2024-01-12'),
    nextHearingDate: new Date('2024-01-20'),
    urgency: 'warning',
    orders: [
      {
        id: "order_3",
        caseNumber: "CWP/6789/2024",
        orderDate: new Date('2024-01-12'),
        uploadDate: new Date('2024-01-12'),
        fileName: "status_report_order_12_jan_2024.pdf",
        fileUrl: "/mock-file-3.pdf",
        summary: "Municipal Corporation directed to submit status report on unauthorized construction within 7 days.",
        actionRequired: "Coordinate with Municipal Corporation to prepare and submit status report",
        deadline: new Date('2024-01-19'),
        status: 'in-progress'
      }
    ]
  },
  {
    id: "case_3",
    caseNumber: "PIL/9876/2023",
    petitioner: "Punjab Pollution Control Board",
    respondent: "Industrial Units & Others",
    courtName: "Punjab & Haryana High Court",
    latestOrderDate: new Date('2024-01-08'),
    nextHearingDate: new Date('2024-02-15'),
    urgency: 'normal',
    orders: [
      {
        id: "order_4",
        caseNumber: "PIL/9876/2023",
        orderDate: new Date('2024-01-08'),
        uploadDate: new Date('2024-01-08'),
        fileName: "compliance_order_08_jan_2024.pdf",
        fileUrl: "/mock-file-4.pdf",
        summary: "Industrial units directed to submit compliance report on environmental norms.",
        actionRequired: "Monitor compliance and prepare consolidated report",
        status: 'completed'
      }
    ]
  }
];

export const getMockDashboardData = (): DashboardData => {
  const allOrders = mockCases.flatMap(case_ => case_.orders);
  const pendingOrders = allOrders.filter(order => order.status !== 'completed');
  const completedOrders = allOrders.filter(order => order.status === 'completed');
  const urgentCases = mockCases.filter(case_ => case_.urgency === 'urgent');

  return {
    cases: mockCases,
    totalCases: mockCases.length,
    pendingOrders: pendingOrders.length,
    completedOrders: completedOrders.length,
    urgentCases: urgentCases.length,
  };
};