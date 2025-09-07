import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

interface DashboardStatsProps {
  totalCases: number;
  pendingOrders: number;
  completedOrders: number;
  urgentCases: number;
}

export function DashboardStats({ totalCases, pendingOrders, completedOrders, urgentCases }: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Cases",
      value: totalCases,
      description: "Active court cases",
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      description: "Requiring action",
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Completed Orders",
      value: completedOrders,
      description: "Successfully processed",
      icon: CheckCircle2,
      color: "text-success",
    },
    {
      title: "Urgent Cases",
      value: urgentCases,
      description: "Action needed within 2 days",
      icon: AlertTriangle,
      color: "text-urgent",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <CardDescription className="text-xs">{stat.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}