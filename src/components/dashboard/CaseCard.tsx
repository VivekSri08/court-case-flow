import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, FileText, Calendar, Upload } from "lucide-react";
import { CourtCase } from "@/types/court-case";
import { OrdersList } from "./OrdersList";
import { format } from "date-fns";

interface CaseCardProps {
  courtCase: CourtCase;
  onStatusUpdate: (caseId: string, orderId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  onUploadOrder: (caseNumber: string) => void;
}

export function CaseCard({ courtCase, onStatusUpdate, onUploadOrder }: CaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getUrgencyColor = (urgency: 'urgent' | 'warning' | 'normal') => {
    switch (urgency) {
      case 'urgent': return 'bg-urgent text-urgent-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'normal': return 'bg-success text-success-foreground';
    }
  };

  const getUrgencyText = (urgency: 'urgent' | 'warning' | 'normal') => {
    switch (urgency) {
      case 'urgent': return 'Action within 2 days';
      case 'warning': return 'Action within 5 days';
      case 'normal': return 'No immediate deadline';
    }
  };

  const pendingOrders = courtCase.orders.filter(order => order.status !== 'completed');
  const completedOrders = courtCase.orders.filter(order => order.status === 'completed');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{courtCase.caseNumber}</CardTitle>
            <CardDescription className="text-sm">
              <span className="font-medium">Petitioner:</span> {courtCase.petitioner}
            </CardDescription>
            <CardDescription className="text-sm">
              <span className="font-medium">Respondent:</span> {courtCase.respondent}
            </CardDescription>
            <CardDescription className="text-sm">
              <span className="font-medium">Court:</span> {courtCase.courtName}
            </CardDescription>
          </div>
          <Badge className={getUrgencyColor(courtCase.urgency)}>
            {getUrgencyText(courtCase.urgency)}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>Latest: {format(courtCase.latestOrderDate, 'dd/MM/yyyy')}</span>
          </div>
          {courtCase.nextHearingDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Next: {format(courtCase.nextHearingDate, 'dd/MM/yyyy')}</span>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUploadOrder(courtCase.caseNumber)}
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload Order
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
            />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}