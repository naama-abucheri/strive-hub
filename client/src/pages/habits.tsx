import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import HabitForm from "@/components/habit-form";
import { Plus, Menu, Calendar, Flame, Trash2, Edit, Check } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Habit } from "@shared/schema";

export default function Habits() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const { data: habits, isLoading: habitsLoading } = useQuery({
    queryKey: ["/api/habits"],
    enabled: isAuthenticated,
  });

  const deleteHabitMutation = useMutation({
    mutationFn: async (habitId: string) => {
      await apiRequest("DELETE", `/api/habits/${habitId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({
        title: "Success",
        description: "Habit deleted successfully",
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
        description: "Failed to delete habit",
        variant: "destructive",
      });
    },
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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      health: "bg-emerald-100 text-emerald-600",
      learning: "bg-blue-100 text-blue-600",
      productivity: "bg-amber-100 text-amber-600",
      personal: "bg-purple-100 text-purple-600",
      general: "bg-slate-100 text-slate-600",
    };
    return <Badge className={colors[category as keyof typeof colors] || colors.general}>
      {category}
    </Badge>;
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Habits</h2>
                  <p className="text-slate-600">Build lasting habits and track your streaks</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Dialog open={isHabitFormOpen} onOpenChange={setIsHabitFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Habit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <HabitForm onSuccess={() => setIsHabitFormOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {habitsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading habits...</p>
                </div>
              </div>
            ) : !habits || habits.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">No habits yet</h3>
                <p className="text-slate-600 mb-6">Start building positive habits to improve your daily routine.</p>
                <Dialog open={isHabitFormOpen} onOpenChange={setIsHabitFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
              <div className="grid gap-6">
                {habits.map((habit: Habit) => (
                  <Card key={habit.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <CardTitle className="text-xl">{habit.name}</CardTitle>
                            {getCategoryBadge(habit.category)}
                          </div>
                          {habit.description && (
                            <p className="text-slate-600 text-sm">{habit.description}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingHabit(habit);
                              setIsHabitFormOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteHabitMutation.mutate(habit.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-2"
                            onClick={() => toggleHabitMutation.mutate({
                              habitId: habit.id,
                              date: today,
                              completed: true // This would be dynamic based on current completion status
                            })}
                          >
                            <Check className="w-4 h-4" />
                            <span>Mark Complete Today</span>
                          </Button>
                          <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span>0 day streak</span> {/* This would be calculated from completions */}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">
                            Status: {habit.isActive ? "Active" : "Paused"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>

        <SheetContent side="left" className="w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Edit Habit Dialog */}
      <Dialog open={!!editingHabit} onOpenChange={(open) => !open && setEditingHabit(null)}>
        <DialogContent>
          <HabitForm 
            habit={editingHabit} 
            onSuccess={() => {
              setEditingHabit(null);
              setIsHabitFormOpen(false);
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
