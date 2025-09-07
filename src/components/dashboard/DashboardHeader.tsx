import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Upload, LogOut, Scale, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onUploadOrder: () => void;
  onLogout: () => void;
}

export function DashboardHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onUploadOrder,
  onLogout,
}: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Scale className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">CourtTracker</h1>
            <p className="text-sm text-muted-foreground">Legal Case Management Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/profile')}
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by case number, petitioner, or court..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cases</SelectItem>
            <SelectItem value="urgent">Urgent Cases</SelectItem>
            <SelectItem value="pending">Pending Orders</SelectItem>
            <SelectItem value="completed">Completed Orders</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onUploadOrder}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Order
        </Button>
      </div>
    </div>
  );
}