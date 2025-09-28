import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Users, Building, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CourtCase } from "@/types/court-case";
import { CaseTimeline } from "@/components/case/CaseTimeline";
import { StatusSelector } from "@/components/case/StatusSelector";
import { FollowUpUpload } from "@/components/case/FollowUpUpload";

const CaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [courtCase, setCourtCase] = useState<CourtCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCaseDetails = async () => {
    if (!user || !id) return;
    
    try {
      setIsLoading(true);
      
      // Fetch case details
      const { data: caseData, error: caseError } = await supabase
        .from('court_cases')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (caseError) throw caseError;

      // Fetch orders for this case
      const { data: orders, error: ordersError } = await supabase
        .from('court_orders')
        .select('*')
        .eq('case_id', id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Format the case data
      const formattedCase: CourtCase = {
        id: caseData.id,
        caseNumber: caseData.case_number,
        petitioner: caseData.petitioner,
        respondent: caseData.respondent,
        courtName: caseData.court_name || '',
        latestOrderDate: caseData.latest_order_date ? new Date(caseData.latest_order_date) : new Date(),
        nextHearingDate: caseData.next_hearing_date ? new Date(caseData.next_hearing_date) : undefined,
        urgency: caseData.urgency as 'urgent' | 'warning' | 'normal',
        orders: orders?.map(order => ({
          id: order.id,
          caseNumber: caseData.case_number,
          orderDate: new Date(order.order_date),
          uploadDate: new Date(order.created_at),
          fileName: order.file_name,
          fileUrl: order.file_url,
          thumbnail: order.thumbnail_url,
          summary: order.summary || '',
          actionRequired: order.action_required || '',
          deadline: order.deadline ? new Date(order.deadline) : undefined,
          status: order.status as 'pending' | 'in-progress' | 'completed'
        })) || []
      };

      setCourtCase(formattedCase);
    } catch (error) {
      console.error('Error fetching case details:', error);
      toast({
        title: "Error",
        description: "Failed to load case details",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseDetails();
  }, [id, user]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-500 text-red-50';
      case 'warning':
        return 'bg-yellow-500 text-yellow-50';
      default:
        return 'bg-green-500 text-green-50';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'Urgent';
      case 'warning':
        return 'Warning';
      default:
        return 'Normal';
    }
  };

  const handleStatusUpdate = async (orderId: string, status: 'pending' | 'in-progress' | 'completed') => {
    try {
      const { error } = await supabase
        .from('court_orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      if (courtCase) {
        setCourtCase({
          ...courtCase,
          orders: courtCase.orders.map(order =>
            order.id === orderId ? { ...order, status } : order
          )
        });
      }

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

  const handleFollowUpUpload = () => {
    fetchCaseDetails();
    toast({
      title: "Upload successful",
      description: "Follow-up document uploaded successfully",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (!courtCase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Case not found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Case Overview */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{courtCase.caseNumber}</CardTitle>
                <CardDescription className="text-base">
                  {courtCase.petitioner} vs. {courtCase.respondent}
                </CardDescription>
              </div>
              <Badge className={getUrgencyColor(courtCase.urgency)}>
                {getUrgencyText(courtCase.urgency)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Court</p>
                  <p className="text-sm text-muted-foreground">{courtCase.courtName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Petitioner</p>
                  <p className="text-sm text-muted-foreground">{courtCase.petitioner}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Latest Order</p>
                  <p className="text-sm text-muted-foreground">
                    {courtCase.latestOrderDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {courtCase.nextHearingDate && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Next Hearing</p>
                    <p className="text-sm text-muted-foreground">
                      {courtCase.nextHearingDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Follow-up Upload */}
        <FollowUpUpload
          caseId={courtCase.id}
          caseNumber={courtCase.caseNumber}
          onUpload={handleFollowUpUpload}
        />

        {/* Case Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Case Timeline
            </CardTitle>
            <CardDescription>
              Complete history of all documents and actions for this case
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <CaseTimeline
              orders={courtCase.orders}
              onStatusUpdate={handleStatusUpdate}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CaseDetail;