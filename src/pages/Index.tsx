import { useState, useMemo } from "react";
import { LoginPage } from "@/components/auth/LoginPage";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CaseCard } from "@/components/dashboard/CaseCard";
import { UploadOrderDialog } from "@/components/dashboard/UploadOrderDialog";
import { getMockDashboardData } from "@/data/mockData";
import { CourtCase, CourtOrder } from "@/types/court-case";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardData, setDashboardData] = useState(getMockDashboardData());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string>();
  const { toast } = useToast();

  const filteredCases = useMemo(() => {
    let filtered = dashboardData.cases;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(case_ =>
        case_.caseNumber.toLowerCase().includes(query) ||
        case_.petitioner.toLowerCase().includes(query) ||
        case_.respondent.toLowerCase().includes(query) ||
        case_.courtName.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "urgent":
          filtered = filtered.filter(case_ => case_.urgency === 'urgent');
          break;
        case "pending":
          filtered = filtered.filter(case_ => 
            case_.orders.some(order => order.status !== 'completed')
          );
          break;
        case "completed":
          filtered = filtered.filter(case_ => 
            case_.orders.every(order => order.status === 'completed')
          );
          break;
      }
    }

    return filtered;
  }, [dashboardData.cases, searchQuery, statusFilter]);

  // Calculate stats - moved before conditional return
  const stats = useMemo(() => {
    const allOrders = dashboardData.cases.flatMap(case_ => case_.orders);
    const pendingOrders = allOrders.filter(order => order.status !== 'completed');
    const completedOrders = allOrders.filter(order => order.status === 'completed');
    const urgentCases = dashboardData.cases.filter(case_ => case_.urgency === 'urgent');

    return {
      totalCases: dashboardData.cases.length,
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
      urgentCases: urgentCases.length,
    };
  }, [dashboardData.cases]);

  const handleStatusUpdate = (caseId: string, orderId: string, status: 'pending' | 'in-progress' | 'completed') => {
    setDashboardData(prev => ({
      ...prev,
      cases: prev.cases.map(case_ => 
        case_.id === caseId
          ? {
              ...case_,
              orders: case_.orders.map(order =>
                order.id === orderId ? { ...order, status } : order
              )
            }
          : case_
      )
    }));

    toast({
      title: "Status updated",
      description: `Order status changed to ${status.replace('-', ' ')}`,
    });
  };

  const handleUploadOrder = (orderData: CourtOrder) => {
    setDashboardData(prev => {
      const existingCaseIndex = prev.cases.findIndex(
        case_ => case_.caseNumber === orderData.caseNumber
      );

      if (existingCaseIndex >= 0) {
        // Add to existing case
        const updatedCases = [...prev.cases];
        updatedCases[existingCaseIndex] = {
          ...updatedCases[existingCaseIndex],
          orders: [...updatedCases[existingCaseIndex].orders, orderData],
          latestOrderDate: orderData.orderDate > updatedCases[existingCaseIndex].latestOrderDate 
            ? orderData.orderDate 
            : updatedCases[existingCaseIndex].latestOrderDate
        };
        return { ...prev, cases: updatedCases };
      } else {
        // Create new case
        const newCase: CourtCase = {
          id: `case_${Date.now()}`,
          caseNumber: orderData.caseNumber,
          petitioner: "New Petitioner",
          respondent: "New Respondent",
          courtName: "Court Name",
          latestOrderDate: orderData.orderDate,
          orders: [orderData],
          urgency: 'normal'
        };
        return { ...prev, cases: [...prev.cases, newCase] };
      }
    });
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto p-6 space-y-6">
        <DashboardHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onUploadOrder={() => {
            setSelectedCaseNumber(undefined);
            setUploadDialogOpen(true);
          }}
          onLogout={() => setIsAuthenticated(false)}
        />

        <DashboardStats {...stats} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Cases ({filteredCases.length})
            </h2>
          </div>

          {filteredCases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No cases found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCases.map(courtCase => (
                <CaseCard
                  key={courtCase.id}
                  courtCase={courtCase}
                  onStatusUpdate={handleStatusUpdate}
                  onUploadOrder={(caseNumber) => {
                    setSelectedCaseNumber(caseNumber);
                    setUploadDialogOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <UploadOrderDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          caseNumber={selectedCaseNumber}
          onUpload={handleUploadOrder}
        />
      </div>
    </div>
  );
};

export default Index;
