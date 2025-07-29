import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Flame, TrendingUp, Calendar, ArrowUp } from "lucide-react";

export default function StatsCards() {
  const { data: goals } = useQuery({
    queryKey: ["/api/goals"],
  });

  const { data: habits } = useQuery({
    queryKey: ["/api/habits"],
  });

  const { data: streaks } = useQuery({
    queryKey: ["/api/analytics/streaks"],
  });

  const activeGoals = goals?.filter((goal: any) => goal.status === "active")?.length || 0;
  const activeHabits = habits?.filter((habit: any) => habit.isActive)?.length || 0;
  const currentStreak = streaks?.reduce((max: number, streak: any) => 
    Math.max(max, streak.currentStreak), 0) || 0;
  
  // Calculate completion rate (simplified)
  const completedGoals = goals?.filter((goal: any) => goal.status === "completed")?.length || 0;
  const totalGoals = goals?.length || 0;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Active Goals</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{activeGoals}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target className="text-blue-600 text-lg" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {activeGoals > 0 && (
              <ArrowUp className="text-green-500 text-sm mr-1" />
            )}
            <span className="text-slate-600 text-sm">
              {activeGoals > 0 ? "goals in progress" : "no active goals"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Current Streak</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{currentStreak}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Flame className="text-emerald-600 text-lg" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-slate-600 text-sm">days consecutive</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Completion Rate</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-amber-600 text-lg" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {completionRate > 0 && (
              <ArrowUp className="text-green-500 text-sm mr-1" />
            )}
            <span className="text-slate-600 text-sm">goal completion</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Daily Habits</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{activeHabits}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Calendar className="text-purple-600 text-lg" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-slate-600 text-sm">tracked today</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
