import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseNumber?: string;
  onUpload: (orderData: any) => void;
}

export function UploadOrderDialog({ open, onOpenChange, caseNumber, onUpload }: UploadOrderDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    caseNumber: caseNumber || '',
    orderDate: '',
    summary: '',
    actionRequired: '',
    deadline: '',
  });
  const [isUploading, setIsUploading] = useState(false);
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
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.caseNumber || !formData.summary || !formData.actionRequired) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Simulate file upload and processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const orderData = {
        id: `order_${Date.now()}`,
        caseNumber: formData.caseNumber,
        orderDate: new Date(formData.orderDate),
        uploadDate: new Date(),
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        summary: formData.summary,
        actionRequired: formData.actionRequired,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
        status: 'pending' as const,
      };

      onUpload(orderData);
      
      toast({
        title: "Order uploaded successfully",
        description: `${file.name} has been uploaded and processed`,
      });
      
      // Reset form
      setFile(null);
      setFormData({
        caseNumber: '',
        orderDate: '',
        summary: '',
        actionRequired: '',
        deadline: '',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Court Order</DialogTitle>
          <DialogDescription>
            Upload a PDF or image file of the court order. The system will automatically extract relevant information.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Document File *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="file:mr-2 file:rounded file:border-0 file:bg-primary file:text-primary-foreground"
              />
            </div>
            {file && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="caseNumber">Case Number *</Label>
            <Input
              id="caseNumber"
              value={formData.caseNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, caseNumber: e.target.value }))}
              placeholder="e.g., WP/12345/2024"
              disabled={!!caseNumber}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderDate">Order Date *</Label>
            <Input
              id="orderDate"
              type="date"
              value={formData.orderDate}
              onChange={(e) => setFormData(prev => ({ ...prev, orderDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Order Summary *</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Brief summary of the court order..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actionRequired">Action Required *</Label>
            <Textarea
              id="actionRequired"
              value={formData.actionRequired}
              onChange={(e) => setFormData(prev => ({ ...prev, actionRequired: e.target.value }))}
              placeholder="What actions need to be taken..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline (Optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
            />
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
              disabled={isUploading}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}