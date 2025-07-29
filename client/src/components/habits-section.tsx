import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import HabitForm from "@/components/habit-form";
import { Calendar, Check, Plus } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Habit } from "@shared/schema";

export default function HabitsSection() {
  const { toast } = useToast();
  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);

  const { data: habits, isLoading } = useQuery({
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
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Today's Habits</span>
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
          <Calendar className="w-5 h-5" />
          <span>Today's Habits</span>
        </CardTitle>
        <Dialog open={isHabitFormOpen} onOpenChange={setIsHabitFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <HabitForm onSuccess={() => setIsHabitFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!habits || habits.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No habits yet</p>
            <Dialog open={isHabitFormOpen} onOpenChange={setIsHabitFormOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
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
          <div className="space-y-3">
            {habits.slice(0, 5).map((habit: Habit) => (
              <div key={habit.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                    onClick={() => toggleHabitMutation.mutate({
                      habitId: habit.id,
                      date: today,
                      completed: true // This would be dynamic based on current completion status
                    })}
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  <div>
                    <p className="font-medium text-slate-800">{habit.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {habit.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  0 day streak {/* This would be calculated from completions */}
                </div>
              </div>
            ))}
            {habits.length > 5 && (
              <p className="text-sm text-slate-500 text-center pt-2">
                +{habits.length - 5} more habits
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}