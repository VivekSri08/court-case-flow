import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseNumber?: string;
  onUpload: (orderData: any) => void;
}

export function UploadOrderDialog({ open, onOpenChange, caseNumber, onUpload }: UploadOrderDialogProps) {
  const [courtOrderFile, setCourtOrderFile] = useState<File | null>(null);
  const [caseStatusFile, setCaseStatusFile] = useState<File | null>(null);
  // Remove form data state - we only need files now
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'courtOrder' | 'caseStatus') => {
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
      
      if (fileType === 'courtOrder') {
        setCourtOrderFile(selectedFile);
      } else {
        setCaseStatusFile(selectedFile);
      }
    }
  };

  const removeFile = (fileType: 'courtOrder' | 'caseStatus') => {
    if (fileType === 'courtOrder') {
      setCourtOrderFile(null);
    } else {
      setCaseStatusFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courtOrderFile && !caseStatusFile) {
      toast({
        title: "Missing files",
        description: "Please upload at least one file (Court Order or Case Status)",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to upload files",
          variant: "destructive",
        });
        return;
      }

      // Create timestamp for consistent file naming
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

      // Prepare form data for webhook with improved file naming
      const webhookFormData = new FormData();
      webhookFormData.append('userId', user.id);
      
      if (courtOrderFile) {
        // Create a new file with standardized naming
        const courtOrderBlob = new Blob([courtOrderFile], { type: courtOrderFile.type });
        const standardizedCourtOrder = new File(
          [courtOrderBlob], 
          `court-order-${timestamp}.${courtOrderFile.name.split('.').pop()}`,
          { type: courtOrderFile.type }
        );
        webhookFormData.append('data', standardizedCourtOrder);
      }
      if (caseStatusFile) {
        // Create a new file with standardized naming
        const caseStatusBlob = new Blob([caseStatusFile], { type: caseStatusFile.type });
        const standardizedCaseStatus = new File(
          [caseStatusBlob], 
          `case-status-${timestamp}.${caseStatusFile.name.split('.').pop()}`,
          { type: caseStatusFile.type }
        );
        webhookFormData.append('data', standardizedCaseStatus);
      }

      // Send to webhook
      const webhookResponse = await fetch('https://anant1213.app.n8n.cloud/webhook/879b0f6a-f7f7-4cab-b663-9c69e716bbce', {
        method: 'POST',
        body: webhookFormData,
      });

      if (!webhookResponse.ok) {
        throw new Error('Webhook upload failed');
      }

      // Also upload files to Supabase storage for backup/viewing
      const uploadPromises = [];
      
      if (courtOrderFile) {
        const courtOrderPath = `${user.id}/court-order-${timestamp}.${courtOrderFile.name.split('.').pop()}`;
        uploadPromises.push(
          supabase.storage.from('court-documents').upload(courtOrderPath, courtOrderFile)
        );
      }
      
      if (caseStatusFile) {
        const caseStatusPath = `${user.id}/case-status-${timestamp}.${caseStatusFile.name.split('.').pop()}`;
        uploadPromises.push(
          supabase.storage.from('court-documents').upload(caseStatusPath, caseStatusFile)
        );
      }

      await Promise.all(uploadPromises);
      
      toast({
        title: "Documents uploaded successfully",
        description: "Files have been sent for processing and will appear in your dashboard shortly",
      });
      
      // Reset form
      setCourtOrderFile(null);
      setCaseStatusFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Please try again. If the issue persists, contact support.",
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
          <DialogTitle>Upload Court Documents</DialogTitle>
          <DialogDescription>
            Upload court order and/or case status documents. The AI will automatically extract case details, order information, and required actions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Court Order Document</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'courtOrder')}
                  className="file:mr-2 file:rounded file:border-0 file:bg-primary file:text-primary-foreground"
                />
              </div>
              {courtOrderFile && (
                <div className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4" />
                    <span>{courtOrderFile.name} ({(courtOrderFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('courtOrder')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Case Status Document</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'caseStatus')}
                  className="file:mr-2 file:rounded file:border-0 file:bg-primary file:text-primary-foreground"
                />
              </div>
              {caseStatusFile && (
                <div className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4" />
                    <span>{caseStatusFile.name} ({(caseStatusFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile('caseStatus')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
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