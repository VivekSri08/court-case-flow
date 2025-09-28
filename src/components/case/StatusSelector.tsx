import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Clock, Play, CheckCircle } from "lucide-react";

interface StatusSelectorProps {
  currentStatus: 'pending' | 'in-progress' | 'completed';
  onStatusChange: (status: 'pending' | 'in-progress' | 'completed') => void;
}

export const StatusSelector = ({ currentStatus, onStatusChange }: StatusSelectorProps) => {
  const statusOptions = [
    {
      value: 'pending' as const,
      label: 'Pending',
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      value: 'in-progress' as const,
      label: 'In Progress',
      icon: Play,
      color: 'text-blue-600'
    },
    {
      value: 'completed' as const,
      label: 'Completed',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  const currentOption = statusOptions.find(option => option.value === currentStatus);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {statusOptions.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={`cursor-pointer ${
                currentStatus === option.value ? 'bg-muted' : ''
              }`}
            >
              <Icon className={`mr-2 h-3 w-3 ${option.color}`} />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};