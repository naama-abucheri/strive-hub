import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

export default function AnalyticsSidebar() {
  const { data: categories } = useQuery({
    queryKey: ["/api/analytics/categories"],
  });

  const { data: streaks } = useQuery({
    queryKey: ["/api/analytics/streaks"],
  });

  return (
    <div className="space-y-6">
      {/* Habit Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <BarChart3 className="w-5 h-5" />
            <span>Habit Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories && categories.length > 0 ? (
            <div className="space-y-3">
              {categories.slice(0, 5).map((category: { category: string; count: number }, index: number) => {
                const colors = [
                  "bg-blue-500",
                  "bg-emerald-500", 
                  "bg-amber-500",
                  "bg-purple-500",
                  "bg-pink-500"
                ];
                return (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${colors[index % colors.length]} rounded-full`}></div>
                      <span className="text-sm font-medium text-slate-700 capitalize">
                        {category.category}
                      </span>
                    </div>
                    <span className="text-sm text-slate-600">{category.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <BarChart3 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No categories yet</p>
              <p className="text-xs text-slate-400">Create habits to see breakdown</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Streaks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg">
            <TrendingUp className="w-5 h-5" />
            <span>Top Streaks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {streaks && streaks.length > 0 ? (
            <div className="space-y-3">
              {streaks.slice(0, 3).map((streak: { habitId: string; habitName: string; currentStreak: number }, index: number) => (
                <div key={streak.habitId} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {streak.habitName || "Habit"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{streak.currentStreak}</p>
                    <p className="text-xs text-slate-500">days</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <TrendingUp className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No streaks yet</p>
              <p className="text-xs text-slate-400">Complete habits to build streaks</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}