import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Eye, Calendar, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CourtOrder {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  order_date: string;
  deadline?: string;
  summary?: string;
  action_required?: string;
  status: 'pending' | 'in-progress' | 'completed';
  created_at: string;
  completion_date?: string;
  completion_document_url?: string;
}

interface ViewOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
  caseNumber: string;
}

export function ViewOrdersDialog({ open, onOpenChange, caseId, caseNumber }: ViewOrdersDialogProps) {
  const [orders, setOrders] = useState<CourtOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && caseId) {
      fetchOrders();
    }
  }, [open, caseId]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('court_orders')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('court-documents')
        .download(fileUrl);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download Failed',
        description: 'Could not download the file',
        variant: 'destructive',
      });
    }
  };

  const handleView = async (fileUrl: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('court-documents')
        .createSignedUrl(fileUrl, 3600); // 1 hour

      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('View error:', error);
      toast({
        title: 'View Failed',
        description: 'Could not open the file',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Court Orders - {caseNumber}</DialogTitle>
          <DialogDescription>
            View and manage all documents related to this case
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading orders...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
                <p className="text-muted-foreground">No court orders have been uploaded for this case yet.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div key={order.id}>
                  <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                    <div className="flex-shrink-0">
                      {getFileIcon(order.file_type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-card-foreground truncate">
                            {order.file_name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Order: {format(new Date(order.order_date), 'MMM dd, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Uploaded: {format(new Date(order.created_at), 'MMM dd, yyyy')}</span>
                            </div>
                            {order.deadline && (
                              <div className="flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                <span>Deadline: {format(new Date(order.deadline), 'MMM dd, yyyy')}</span>
                              </div>
                            )}
                            {order.status === 'completed' && order.completion_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-green-600" />
                                <span>Completed: {format(new Date(order.completion_date), 'MMM dd, yyyy')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(order.status)} border`}>
                            {order.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>

                      {(order.summary || order.action_required) && (
                        <div className="mt-3 space-y-2">
                          {order.summary && (
                            <div>
                              <p className="text-sm font-medium text-card-foreground">Summary:</p>
                              <p className="text-sm text-muted-foreground">{order.summary}</p>
                            </div>
                          )}
                          {order.action_required && (
                            <div>
                              <p className="text-sm font-medium text-card-foreground">Action Required:</p>
                              <p className="text-sm text-muted-foreground">{order.action_required}</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(order.file_url)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View Order
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(order.file_url, order.file_name)}
                          className="flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                        {order.status === 'completed' && order.completion_document_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(order.completion_document_url!)}
                            className="flex items-center gap-1"
                          >
                            <FileText className="w-4 h-4" />
                            View Completion Doc
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < orders.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}