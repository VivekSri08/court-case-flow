import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
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
    setUploadProgress(10);
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

      setUploadProgress(20);
      
      // Create timestamp for consistent file naming
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const folderCaseNumber = caseNumber || `case-${timestamp}`;

      setUploadProgress(40);
      
      // Prepare form data for single webhook
      const webhookFormData = new FormData();
      webhookFormData.append('userId', user.id);
      webhookFormData.append('caseNumber', folderCaseNumber);
      
      if (courtOrderFile) {
        webhookFormData.append('courtOrderFilePath', `${user.id}/${folderCaseNumber}/court-order-${timestamp}.${courtOrderFile.name.split('.').pop()}`);
        
        const courtOrderBlob = new Blob([courtOrderFile], { type: courtOrderFile.type });
        const standardizedCourtOrder = new File(
          [courtOrderBlob], 
          `court-order-${timestamp}.${courtOrderFile.name.split('.').pop()}`,
          { type: courtOrderFile.type }
        );
        webhookFormData.append('courtOrder', standardizedCourtOrder);
      }
      
      if (caseStatusFile) {
        webhookFormData.append('caseStatusFilePath', `${user.id}/${folderCaseNumber}/case-status-${timestamp}.${caseStatusFile.name.split('.').pop()}`);
        
        const caseStatusBlob = new Blob([caseStatusFile], { type: caseStatusFile.type });
        const standardizedCaseStatus = new File(
          [caseStatusBlob], 
          `case-status-${timestamp}.${caseStatusFile.name.split('.').pop()}`,
          { type: caseStatusFile.type }
        );
        webhookFormData.append('caseStatus', standardizedCaseStatus);
      }

      setUploadProgress(60);
      
      // Send to single webhook
      const webhookResponse = await fetch('https://anant1213.app.n8n.cloud/webhook/f72270a3-715a-4fd1-882a-f5d2fb4c499d', {
        method: 'POST',
        body: webhookFormData,
      });

      setUploadProgress(80);

      if (!webhookResponse.ok) {
        throw new Error('Upload failed');
      }

      setUploadProgress(100);
      setIsSuccess(true);
      
      // Show success message
      toast({
        title: "Documents uploaded successfully",
        description: "Files are being processed. Your dashboard will update automatically when ready.",
      });

      // Wait a moment to show success state, then close and reset
      setTimeout(() => {
        setCourtOrderFile(null);
        setCaseStatusFile(null);
        setIsSuccess(false);
        setUploadProgress(0);
        onUpload(null); // Trigger immediate refresh
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Please try again. If the issue persists, contact support.",
        variant: "destructive",
      });
    } finally {
      if (!isSuccess) {
        setIsUploading(false);
        setUploadProgress(0);
      }
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

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {isSuccess && (
            <div className="flex items-center justify-center gap-2 p-4 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Upload successful!</span>
            </div>
          )}

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
              disabled={isUploading || isSuccess}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Processing..." : isSuccess ? "Completed!" : "Upload Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}