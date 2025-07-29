import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import StatsCards from "@/components/stats-cards";
import HabitsSection from "@/components/habits-section";
import GoalsSection from "@/components/goals-section";
import AnalyticsSidebar from "@/components/analytics-sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import GoalForm from "@/components/goal-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);

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
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
                  <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
                  <p className="text-slate-600">Track your progress and stay motivated</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Dialog open={isGoalFormOpen} onOpenChange={setIsGoalFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <GoalForm onSuccess={() => setIsGoalFormOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* Stats Overview */}
            <StatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Today's Habits and Goals */}
              <div className="lg:col-span-2 space-y-6">
                <HabitsSection />
                <GoalsSection />
              </div>

              {/* Analytics Sidebar */}
              <AnalyticsSidebar />
            </div>
          </main>
        </div>

        <SheetContent side="left" className="w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
}
