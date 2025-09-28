import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, FileText, Calendar, Upload, Eye, Trash2 } from "lucide-react";
import { CourtCase } from "@/types/court-case";
import { OrdersList } from "./OrdersList";
import { ViewOrdersDialog } from "./ViewOrdersDialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CaseCardProps {
  courtCase: CourtCase;
  onStatusUpdate: (caseId: string, orderId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  onUploadOrder: (caseNumber: string) => void;
  onDeleteOrder?: (caseId: string, orderId: string) => void;
  onDeleteCase?: (caseId: string) => void;
  onViewDetails?: (caseId: string) => void;
}

export function CaseCard({ courtCase, onStatusUpdate, onUploadOrder, onDeleteOrder, onDeleteCase, onViewDetails }: CaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showViewOrdersDialog, setShowViewOrdersDialog] = useState(false);
  const { toast } = useToast();

  const getUrgencyColor = (urgency: 'urgent' | 'warning' | 'normal') => {
    switch (urgency) {
      case 'urgent': return 'bg-urgent text-urgent-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'normal': return 'bg-success text-success-foreground';
    }
  };

  const getUrgencyText = (urgency: 'urgent' | 'warning' | 'normal') => {
    // Get timeline from latest order if available
    const latestOrder = courtCase.orders.length > 0 ? courtCase.orders[0] : null;
    if (latestOrder?.deadline) {
      const daysUntilDeadline = Math.ceil((latestOrder.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilDeadline <= 2) return `Deadline in ${daysUntilDeadline} days`;
      if (daysUntilDeadline <= 5) return `Deadline in ${daysUntilDeadline} days`;
      return `Deadline: ${format(latestOrder.deadline, 'dd/MM/yyyy')}`;
    }
    
    switch (urgency) {
      case 'urgent': return 'Action within 2 days';
      case 'warning': return 'Action within 5 days';
      case 'normal': return 'No immediate deadline';
    }
  };

  const handleDeleteCase = async () => {
    if (window.confirm(`Are you sure you want to delete case ${courtCase.caseNumber}? This will also delete all associated orders.`)) {
      try {
        const { error } = await supabase
          .from('court_cases')
          .delete()
          .eq('id', courtCase.id);

        if (error) throw error;

        toast({
          title: "Case deleted",
          description: "Case and all associated orders have been removed.",
        });

        onDeleteCase?.(courtCase.id);
      } catch (error) {
        console.error('Error deleting case:', error);
        toast({
          title: "Error",
          description: "Failed to delete case. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const pendingOrders = courtCase.orders.filter(order => order.status !== 'completed');
  const completedOrders = courtCase.orders.filter(order => order.status === 'completed');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              Case type(Writ A/B/C/PIL): {courtCase.caseNumber}
            </CardTitle>
            <CardDescription className="text-sm">
              <span className="font-medium">Petitioner:</span> {courtCase.petitioner}
            </CardDescription>
            <CardDescription className="text-sm">
              <span className="font-medium">Respondent:</span> {courtCase.respondent}
            </CardDescription>
            <CardDescription className="text-sm">
              <span className="font-medium">Court No.:</span> {courtCase.courtName}
            </CardDescription>
          </div>
          <Badge className={getUrgencyColor(courtCase.urgency)}>
            {getUrgencyText(courtCase.urgency)}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>Last Hearing Date: {format(courtCase.latestOrderDate, 'dd/MM/yyyy')}</span>
          </div>
          {courtCase.nextHearingDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Next Date: {format(courtCase.nextHearingDate, 'dd/MM/yyyy')}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">
              {pendingOrders.length} Pending
            </Badge>
            <Badge variant="outline">
              {completedOrders.length} Completed
            </Badge>
          </div>
          <div className="flex gap-2">
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(courtCase.id)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowViewOrdersDialog(true)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Orders
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUploadOrder(courtCase.caseNumber)}
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload Order
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteCase}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete Case
            </Button>
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>

      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <OrdersList
              orders={courtCase.orders}
              onStatusUpdate={(orderId, status) => onStatusUpdate(courtCase.id, orderId, status)}
              onDeleteOrder={onDeleteOrder ? (orderId) => onDeleteOrder(courtCase.id, orderId) : undefined}
            />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <ViewOrdersDialog
        open={showViewOrdersDialog}
        onOpenChange={setShowViewOrdersDialog}
        caseId={courtCase.id}
        caseNumber={courtCase.caseNumber}
      />
    </Card>
  );
}