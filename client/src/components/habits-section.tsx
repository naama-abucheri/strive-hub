import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import HabitForm from "./habit-form";
import { Plus, Flame, Check, Calendar } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Habit } from "@shared/schema";

export default function HabitsSection() {
  const { toast } = useToast();
  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);

  const { data: habits } = useQuery({
    queryKey: ["/api/habits"],
  });

  const toggleHabitMutation = useMutation({
    mutationFn: async ({ habitId, date, completed }: { habitId: string; date: string; completed: boolean }) => {
      if (completed) {
        await apiRequest("POST", `/api/habits/${habitId}/completions`, { completedAt: date });
      } else {
        await apiRequest("DELETE", `/api/habits/${habitId}/completions/${date}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/streaks"] });
      toast({
        title: "Success",
        description: "Habit updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
    },
  });

  const today = new Date().toISOString().split('T')[0];
  const activeHabits = habits?.filter((habit: Habit) => habit.isActive)?.slice(0, 5) || [];

  return (
    <Card className="shadow-sm border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-800">Today's Habits</CardTitle>
          <Dialog open={isHabitFormOpen} onOpenChange={setIsHabitFormOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <HabitForm onSuccess={() => setIsHabitFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {activeHabits.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No habits yet</p>
            <Dialog open={isHabitFormOpen} onOpenChange={setIsHabitFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Habit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <HabitForm onSuccess={() => setIsHabitFormOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            {activeHabits.map((habit: Habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 rounded-full border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white p-0 transition-colors"
                    onClick={() => toggleHabitMutation.mutate({
                      habitId: habit.id,
                      date: today,
                      completed: true
                    })}
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  <div>
                    <p className="font-medium text-slate-800">{habit.name}</p>
                    <p className="text-sm text-slate-600 flex items-center">
                      <Flame className="inline w-4 h-4 text-orange-500 mr-1" />
                      0 day streak {/* This would be calculated from completions */}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-xs text-slate-500">{habit.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
