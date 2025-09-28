import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Clock, ExternalLink } from "lucide-react";
import { CourtOrder } from "@/types/court-case";
import { StatusSelector } from "./StatusSelector";

interface CaseTimelineProps {
  orders: CourtOrder[];
  onStatusUpdate: (orderId: string, status: 'pending' | 'in-progress' | 'completed') => void;
}

export const CaseTimeline = ({ orders, onStatusUpdate }: CaseTimelineProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-green-50';
      case 'in-progress':
        return 'bg-blue-500 text-blue-50';
      default:
        return 'bg-yellow-500 text-yellow-50';
    }
  };

  const getDocumentType = (fileName: string) => {
    if (fileName.toLowerCase().includes('order')) return 'Order';
    if (fileName.toLowerCase().includes('reply')) return 'Reply';
    if (fileName.toLowerCase().includes('disposal')) return 'Disposal';
    return 'Document';
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No documents uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <div key={order.id} className="relative">
          {/* Timeline connector */}
          {index < orders.length - 1 && (
            <div className="absolute left-6 top-16 w-0.5 h-16 bg-border" />
          )}
          
          <div className="flex gap-4">
            {/* Timeline dot */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            
            {/* Content */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {order.fileName || 'Court Document'}
                      <Badge variant="outline" className="text-xs">
                        {getDocumentType(order.fileName)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {order.summary || 'Processing document...'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace('-', ' ')}
                    </Badge>
                    <StatusSelector
                      currentStatus={order.status}
                      onStatusChange={(status) => onStatusUpdate(order.id, status)}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {order.actionRequired && (
                  <div className="text-sm">
                    <span className="font-medium">Action Required:</span>{' '}
                    <span className="text-muted-foreground">
                      {order.actionRequired}
                    </span>
                  </div>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Order: {order.orderDate.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Uploaded: {order.uploadDate.toLocaleDateString()}</span>
                  </div>
                  
                  {order.deadline && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Deadline: {order.deadline.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                {order.fileUrl && (
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={order.fileUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-3 w-3" />
                        View Document
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
};