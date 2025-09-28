import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CaseCard } from "@/components/dashboard/CaseCard";
import { UploadOrderDialog } from "@/components/dashboard/UploadOrderDialog";
import { CourtCase } from "@/types/court-case";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const CaseDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<{ cases: CourtCase[] }>({ cases: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedCaseNumber, setSelectedCaseNumber] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch cases and orders from database
  const fetchCasesAndOrders = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Fetch cases
      const { data: cases, error: casesError } = await supabase
        .from('court_cases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (casesError) throw casesError;

      // Fetch orders for each case
      const { data: orders, error: ordersError } = await supabase
        .from('court_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Group orders by case_id
      const ordersByCase = orders?.reduce((acc, order) => {
        if (!acc[order.case_id]) acc[order.case_id] = [];
        acc[order.case_id].push({
          id: order.id,
          caseNumber: order.case_id,
          orderDate: new Date(order.order_date),
          uploadDate: new Date(order.created_at),
          fileName: order.file_name,
          fileUrl: order.file_url,
          thumbnail: order.thumbnail_url,
          summary: order.summary || '',
          actionRequired: order.action_required || '',
          deadline: order.deadline ? new Date(order.deadline) : undefined,
          status: order.status as 'pending' | 'in-progress' | 'completed'
        });
        return acc;
      }, {} as Record<string, any[]>) || {};

      // Map cases with their orders
      const formattedCases: CourtCase[] = cases?.map(case_ => ({
        id: case_.id,
        caseNumber: case_.case_number,
        petitioner: case_.petitioner,
        respondent: case_.respondent,
        courtName: case_.court_name || '',
        latestOrderDate: case_.latest_order_date ? new Date(case_.latest_order_date) : new Date(),
        nextHearingDate: case_.next_hearing_date ? new Date(case_.next_hearing_date) : undefined,
        orders: ordersByCase[case_.id]?.map(order => ({
          ...order,
          caseNumber: case_.case_number
        })) || [],
        urgency: case_.urgency as 'urgent' | 'warning' | 'normal'
      })) || [];

      setDashboardData({ cases: formattedCases });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error fetching data",
        description: "Failed to load cases and orders. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchCasesAndOrders();
      
      // Set up polling every 30 seconds
      const pollInterval = setInterval(() => {
        fetchCasesAndOrders();
      }, 30000);

      return () => clearInterval(pollInterval);
    }
  }, [user, loading, navigate]);

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

  // Calculate stats
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

  const handleStatusUpdate = async (caseId: string, orderId: string, status: 'pending' | 'in-progress' | 'completed') => {
    try {
      const { error } = await supabase
        .from('court_orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async (caseId: string, orderId: string) => {
    try {
      const { error } = await supabase
        .from('court_orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      setDashboardData(prev => ({
        ...prev,
        cases: prev.cases.map(case_ => 
          case_.id === caseId
            ? {
                ...case_,
                orders: case_.orders.filter(order => order.id !== orderId)
              }
            : case_
        )
      }));

      toast({
        title: "Order deleted",
        description: "Order has been successfully deleted",
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCase = async (caseId: string) => {
    try {
      // First delete all orders for this case
      const { error: ordersError } = await supabase
        .from('court_orders')
        .delete()
        .eq('case_id', caseId);

      if (ordersError) throw ordersError;

      // Then delete the case
      const { error: caseError } = await supabase
        .from('court_cases')
        .delete()
        .eq('id', caseId);

      if (caseError) throw caseError;

      setDashboardData(prev => ({
        ...prev,
        cases: prev.cases.filter(case_ => case_.id !== caseId)
      }));

      toast({
        title: "Case deleted",
        description: "Case and all associated orders have been deleted",
      });
    } catch (error) {
      console.error('Error deleting case:', error);
      toast({
        title: "Error",
        description: "Failed to delete case",
        variant: "destructive",
      });
    }
  };

  const handleUploadOrder = () => {
    fetchCasesAndOrders();
    toast({
      title: "Upload successful",
      description: "Files have been uploaded for processing. Data will be updated shortly.",
    });
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Court Case Dashboard</h1>
            <p className="text-muted-foreground">Manage and track your court cases</p>
          </div>
          
          <Button 
            onClick={() => navigate('/upload')}
            className="sm:w-auto w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Upload New Case
          </Button>
        </div>

        <DashboardHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onUploadOrder={() => {
            setSelectedCaseNumber(undefined);
            setUploadDialogOpen(true);
          }}
          onLogout={signOut}
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
              <p className="text-muted-foreground mb-4">No cases found matching your criteria.</p>
              <Button onClick={() => navigate('/upload')} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Upload Your First Case
              </Button>
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
                  onDeleteOrder={handleDeleteOrder}
                  onDeleteCase={handleDeleteCase}
                  onViewDetails={(caseId) => navigate(`/case/${caseId}`)}
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

export default CaseDashboard;