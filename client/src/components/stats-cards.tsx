import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Calendar, TrendingUp, Flame } from "lucide-react";

export default function StatsCards() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const statsData = [
    {
      title: "Total Goals",
      value: stats?.totalGoals || 0,
      subtitle: stats?.totalGoals === 0 ? "No goals yet" : "goals created",
      icon: Target,
      color: "text-blue-600",
    },
    {
      title: "Active Habits",
      value: stats?.activeHabits || 0,
      subtitle: stats?.activeHabits === 0 ? "No habits yet" : "habits active",
      icon: Calendar,
      color: "text-emerald-600",
    },
    {
      title: "Goals Completed",
      value: stats?.completedGoals || 0,
      subtitle: `${stats?.goalCompletionRate || 0}% completion rate`,
      icon: TrendingUp,
      color: "text-amber-600",
    },
    {
      title: "Current Streak",
      value: stats?.currentStreak || 0,
      subtitle: "days",
      icon: Flame,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <p className="text-xs text-slate-500">{stat.subtitle}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}