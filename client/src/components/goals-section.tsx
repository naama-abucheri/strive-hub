import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import GoalForm from "./goal-form";
import { Calendar, Clock, Target } from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "wouter";
import type { Goal } from "@shared/schema";

export default function GoalsSection() {
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [, setLocation] = useLocation();

  const { data: goals } = useQuery({
    queryKey: ["/api/goals"],
  });

  const activeGoals = goals?.filter((goal: Goal) => goal.status === "active")?.slice(0, 2) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-600">Completed</Badge>;
      case "paused":
        return <Badge className="bg-amber-100 text-amber-600">Paused</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-600">In Progress</Badge>;
    }
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const end = new Date(deadline);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="shadow-sm border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800">Active Goals</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            onClick={() => setLocation("/goals")}
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeGoals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No active goals yet</p>
            <Dialog open={isGoalFormOpen} onOpenChange={setIsGoalFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200">
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
            {activeGoals.map((goal: Goal) => {
              const daysLeft = getDaysLeft(goal.deadline);
              return (
                <div
                  key={goal.id}
                  className="p-4 border border-slate-200 rounded-lg hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{goal.title}</h4>
                      {goal.description && (
                        <p className="text-sm text-slate-600 mt-1">{goal.description}</p>
                      )}
                    </div>
                    {getStatusBadge(goal.status)}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due: {format(new Date(goal.deadline), "MMM dd, yyyy")}
                      </span>
                      <span className="text-slate-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {daysLeft > 0 ? `${daysLeft} days left` : 
                         daysLeft === 0 ? "Due today" : "Overdue"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-medium text-slate-800">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
