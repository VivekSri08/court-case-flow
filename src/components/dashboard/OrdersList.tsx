import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Calendar, Clock, CheckCircle } from "lucide-react";
import { CourtOrder } from "@/types/court-case";
import { format } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { CompleteOrderDialog } from "./CompleteOrderDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrdersListProps {
  orders: CourtOrder[];
  onStatusUpdate: (orderId: string, status: 'pending' | 'in-progress' | 'completed') => void;
}

interface CompleteOrderDialogState {
  open: boolean;
  orderId: string;
  orderTitle: string;
}

export function OrdersList({ orders, onStatusUpdate }: OrdersListProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [completeDialog, setCompleteDialog] = useState<CompleteOrderDialogState>({
    open: false,
    orderId: '',
    orderTitle: ''
  });
  const { toast } = useToast();

  const pendingOrders = orders.filter(order => order.status !== 'completed');
  const completedOrders = orders.filter(order => order.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'in-progress': return 'bg-primary text-primary-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const OrderCard = ({ order }: { order: CourtOrder }) => (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{order.fileName}</CardTitle>
            <CardDescription className="text-sm">
              {order.summary}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm">
          <span className="font-medium">Action Required:</span> {order.actionRequired}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>Order: {format(order.orderDate, 'dd/MM/yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Uploaded: {format(order.uploadDate, 'dd/MM/yyyy')}</span>
          </div>
          {order.deadline && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Deadline: {format(order.deadline, 'dd/MM/yyyy')}</span>
            </div>
          )}
          {order.status === 'completed' && order.completionDate && (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>Completed: {format(order.completionDate, 'dd/MM/yyyy')}</span>
            </div>
          )}
        </div>

        {order.status === 'completed' && order.completionDocumentUrl && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Completion Document:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  window.open(order.completionDocumentUrl, '_blank');
                } catch (error) {
                  console.error('Error opening document:', error);
                  toast({
                    title: "Error",
                    description: "Could not open the completion document",
                    variant: "destructive",
                  });
                }
              }}
              className="flex items-center gap-1"
            >
              <FileText className="w-4 h-4" />
              View Document
            </Button>
          </div>
        )}

        {order.status !== 'completed' && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select
              value={order.status}
              onValueChange={(value: 'pending' | 'in-progress' | 'completed') => {
                if (value === 'completed') {
                  setCompleteDialog({
                    open: true,
                    orderId: order.id,
                    orderTitle: order.fileName
                  });
                } else {
                  onStatusUpdate(order.id, value);
                }
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const handleOrderComplete = async (orderId: string, completionDate: string, documentUrl?: string) => {
    onStatusUpdate(orderId, 'completed');
    toast({
      title: "Order completed",
      description: "Order has been marked as completed successfully",
    });
  };

  return (
    <div className="space-y-4">
      {pendingOrders.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Active Orders</h4>
          {pendingOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {completedOrders.length > 0 && (
        <Collapsible open={showCompleted} onOpenChange={setShowCompleted}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="text-sm font-medium">
                Completed Orders ({completedOrders.length})
              </span>
              <span className="text-xs text-muted-foreground">
                {showCompleted ? 'Hide' : 'Show'}
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            {completedOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      <CompleteOrderDialog
        open={completeDialog.open}
        onOpenChange={(open) => setCompleteDialog(prev => ({ ...prev, open }))}
        orderId={completeDialog.orderId}
        orderTitle={completeDialog.orderTitle}
        onComplete={handleOrderComplete}
      />
    </div>
  );
}