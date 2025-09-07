import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CompleteOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderTitle: string;
  onComplete: (orderId: string, completionDate: string, documentUrl?: string) => void;
}

export function CompleteOrderDialog({ 
  open, 
  onOpenChange, 
  orderId, 
  orderTitle, 
  onComplete 
}: CompleteOrderDialogProps) {
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().split('T')[0]);
  const [completionDocument, setCompletionDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setCompletionDocument(selectedFile);
    }
  };

  const removeFile = () => {
    setCompletionDocument(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completionDate) {
      toast({
        title: "Missing completion date",
        description: "Please select the completion date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to complete orders",
          variant: "destructive",
        });
        return;
      }

      let documentUrl: string | undefined;

      // Upload completion document if provided
      if (completionDocument) {
        const documentPath = `${user.id}/completion-docs/order-${orderId}-${Date.now()}.${completionDocument.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage
          .from('court-documents')
          .upload(documentPath, completionDocument);

        if (uploadError) {
          throw new Error('Failed to upload completion document');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('court-documents')
          .getPublicUrl(documentPath);
        
        documentUrl = publicUrl;
      }

      // Update the order in database
      const { error } = await supabase
        .from('court_orders')
        .update({ 
          status: 'completed',
          completion_date: completionDate,
          completion_document_url: documentUrl
        })
        .eq('id', orderId);

      if (error) {
        throw new Error('Failed to update order status');
      }

      toast({
        title: "Order completed",
        description: "Order has been marked as completed successfully",
      });

      onComplete(orderId, completionDate, documentUrl);
      
      // Reset form
      setCompletionDate(new Date().toISOString().split('T')[0]);
      setCompletionDocument(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Completion error:', error);
      toast({
        title: "Failed to complete order",
        description: "Please try again. If the issue persists, contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Complete Order</DialogTitle>
          <DialogDescription>
            Mark "{orderTitle}" as completed and upload any completion documents.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="completionDate">Completion Date *</Label>
            <Input
              id="completionDate"
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Completion Document (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileChange}
                className="file:mr-2 file:rounded file:border-0 file:bg-primary file:text-primary-foreground"
              />
            </div>
            {completionDocument && (
              <div className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  <span>{completionDocument.name} ({(completionDocument.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isSubmitting ? "Completing..." : "Complete Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}