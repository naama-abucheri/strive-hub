import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import GoalForm from "@/components/goal-form";
import { Target, Plus, Calendar } from "lucide-react";
import type { Goal } from "@shared/schema";
import { format } from "date-fns";

export default function GoalsSection() {
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);

  const { data: goals, isLoading } = useQuery({
    queryKey: ["/api/goals"],
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-600">Completed</Badge>;
      case "paused":
        return <Badge className="bg-amber-100 text-amber-600">Paused</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-600">Active</Badge>;
    }
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Recent Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5" />
          <span>Recent Goals</span>
        </CardTitle>
        <Dialog open={isGoalFormOpen} onOpenChange={setIsGoalFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <GoalForm onSuccess={() => setIsGoalFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!goals || goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No goals yet</p>
            <Dialog open={isGoalFormOpen} onOpenChange={setIsGoalFormOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <GoalForm onSuccess={() => setIsGoalFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.slice(0, 3).map((goal: Goal) => {
              const daysLeft = getDaysLeft(goal.deadline);
              return (
                <div key={goal.id} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800">{goal.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-500">
                          Due: {format(new Date(goal.deadline), "MMM dd")}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({daysLeft > 0 ? `${daysLeft} days left` : 
                            daysLeft === 0 ? "Due today" : "Overdue"})
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(goal.status)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-medium text-slate-800">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                </div>
              );
            })}
            {goals.length > 3 && (
              <p className="text-sm text-slate-500 text-center pt-2">
                +{goals.length - 3} more goals
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}