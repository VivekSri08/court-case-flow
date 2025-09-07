import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Scale } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGmailLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate Gmail OAuth login
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Login Successful",
        description: "Welcome to Court Case Monitor",
      });
      onLogin();
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Scale className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Court Case Monitor</CardTitle>
            <CardDescription>
              Secure access for government officers
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleGmailLogin}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            <Mail className="w-5 h-5 mr-2" />
            {isLoading ? "Signing in..." : "Sign in with Gmail"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}