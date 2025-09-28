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
    // For testing - use test user ID when no user is logged in
    const testUserId = '550e8400-e29b-41d4-a716-446655440001';
    const currentUserId = user?.id || testUserId;
    
    try {
      setIsLoading(true);
      
      // Fetch cases
      const { data: cases, error: casesError } = await supabase
        .from('court_cases')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });

      if (casesError) throw casesError;

      // Fetch orders for each case
      const { data: orders, error: ordersError } = await supabase
        .from('court_orders')
        .select('*')
        .eq('user_id', currentUserId)
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
    // FOR TESTING: Temporarily bypass auth and use test user ID
    const testUserId = '550e8400-e29b-41d4-a716-446655440001';
    
    // Simulate authenticated state for testing
    if (!user && !loading) {
      // Create a mock user for testing
      const mockUser = {
        id: testUserId,
        email: 'test@example.com',
        user_metadata: {},
        app_metadata: {},
        aud: 'authenticated',
        role: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        confirmation_sent_at: null,
        confirmed_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        phone: null,
        phone_confirmed_at: null,
        recovery_sent_at: null,
        email_change_sent_at: null,
        new_email: null,
        email_change: null,
        new_phone: null,
        phone_change: null,
        phone_change_sent_at: null,
        invited_at: null,
        action_link: null,
        email_change_confirm_status: 0,
        phone_change_confirm_status: 0
      };
      
      // Set up test user data directly for dashboard
      setDashboardData({
        cases: [
          {
            id: '11111111-1111-1111-1111-111111111111',
            caseNumber: 'Writ A: 2024/567',
            petitioner: 'Raj Kumar Sharma',
            respondent: 'State of U.P. and others',
            courtName: 'Court No. 15',
            latestOrderDate: new Date('2024-09-26'),
            nextHearingDate: new Date('2024-09-29'),
            urgency: 'urgent' as const,
            orders: [{
              id: 'a1111111-1111-1111-1111-111111111111',
              caseNumber: 'Writ A: 2024/567',
              orderDate: new Date('2024-09-26'),
              uploadDate: new Date(),
              fileName: 'order_26_09_2024.pdf',
              fileUrl: '/mock-files/order_26_09_2024.pdf',
              summary: 'Court directed petitioner to file rejoinder within 2 days',
              actionRequired: 'File rejoinder affidavit within 2 days',
              deadline: new Date('2024-09-28'),
              status: 'pending' as const
            }]
          },
          {
            id: '22222222-2222-2222-2222-222222222222',
            caseNumber: 'Writ B: 2024/892',
            petitioner: 'Priya Singh',
            respondent: 'Municipal Corporation and others',
            courtName: 'Court No. 7',
            latestOrderDate: new Date('2024-09-25'),
            nextHearingDate: new Date('2024-10-02'),
            urgency: 'warning' as const,
            orders: [{
              id: 'a2222222-2222-2222-2222-222222222222',
              caseNumber: 'Writ B: 2024/892',
              orderDate: new Date('2024-09-25'),
              uploadDate: new Date(),
              fileName: 'notice_25_09_2024.pdf',
              fileUrl: '/mock-files/notice_25_09_2024.pdf',
              summary: 'Notice issued to Municipal Corporation',
              actionRequired: 'Monitor respondent compliance and prepare arguments',
              deadline: new Date('2024-10-23'),
              status: 'in-progress' as const
            }]
          },
          {
            id: '33333333-3333-3333-3333-333333333333',
            caseNumber: 'PIL: 2024/234',
            petitioner: 'Citizens Welfare Association',
            respondent: 'State of U.P. and others',
            courtName: 'Court No. 3',
            latestOrderDate: new Date('2024-09-20'),
            nextHearingDate: new Date('2024-10-15'),
            urgency: 'normal' as const,
            orders: [
              {
                id: 'a3333333-3333-3333-3333-333333333333',
                caseNumber: 'PIL: 2024/234',
                orderDate: new Date('2024-09-20'),
                uploadDate: new Date(),
                fileName: 'compliance_order_20_09_2024.pdf',
                fileUrl: '/mock-files/compliance_order_20_09_2024.pdf',
                summary: 'Court directed state to submit compliance report within 3 weeks',
                actionRequired: 'Review compliance report when filed',
                deadline: new Date('2024-10-11'),
                status: 'pending' as const
              },
              {
                id: 'b3333333-3333-3333-3333-333333333333',
                caseNumber: 'PIL: 2024/234',
                orderDate: new Date('2024-08-15'),
                uploadDate: new Date(),
                fileName: 'interim_order_15_08_2024.pdf',
                fileUrl: '/mock-files/interim_order_15_08_2024.pdf',
                summary: 'Interim directions issued for pollution control measures',
                actionRequired: 'Monitor implementation of interim directions',
                status: 'completed' as const
              }
            ]
          },
          {
            id: '44444444-4444-4444-4444-444444444444',
            caseNumber: 'Criminal: 2024/1456',
            petitioner: 'State vs Amit Kumar',
            respondent: 'Amit Kumar',
            courtName: 'Court No. 12',
            latestOrderDate: new Date('2024-09-22'),
            nextHearingDate: new Date('2024-10-05'),
            urgency: 'warning' as const,
            orders: [{
              id: 'a4444444-4444-4444-4444-444444444444',
              caseNumber: 'Criminal: 2024/1456',
              orderDate: new Date('2024-09-22'),
              uploadDate: new Date(),
              fileName: 'bail_order_reserved_22_09_2024.pdf',
              fileUrl: '/mock-files/bail_order_reserved_22_09_2024.pdf',
              summary: 'Court reserved order on bail application',
              actionRequired: 'Appear for pronouncement of bail order',
              deadline: new Date('2024-10-05'),
              status: 'pending' as const
            }]
          },
          {
            id: '55555555-5555-5555-5555-555555555555',
            caseNumber: 'Civil: 2024/789',
            petitioner: 'ABC Private Ltd',
            respondent: 'XYZ Corporation and others',
            courtName: 'Court No. 9',
            latestOrderDate: new Date('2024-09-28'),
            urgency: 'normal' as const,
            orders: [
              {
                id: 'a5555555-5555-5555-5555-555555555555',
                caseNumber: 'Civil: 2024/789',
                orderDate: new Date('2024-09-28'),
                uploadDate: new Date(),
                fileName: 'final_judgment_28_09_2024.pdf',
                fileUrl: '/mock-files/final_judgment_28_09_2024.pdf',
                summary: 'Final judgment delivered in favor of petitioner with costs',
                actionRequired: 'Case disposed of successfully',
                status: 'completed' as const
              },
              {
                id: 'b5555555-5555-5555-5555-555555555555',
                caseNumber: 'Civil: 2024/789',
                orderDate: new Date('2024-09-10'),
                uploadDate: new Date(),
                fileName: 'arguments_completion_10_09_2024.pdf',
                fileUrl: '/mock-files/arguments_completion_10_09_2024.pdf',
                summary: 'Arguments concluded. Judgment reserved',
                actionRequired: 'Await final judgment',
                status: 'completed' as const
              }
            ]
          }
        ]
      });
      setIsLoading(false);
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

  // For testing: Allow access without authentication
  // if (!user) {
  //   return null;
  // }

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