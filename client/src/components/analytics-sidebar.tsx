import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import GoalForm from "./goal-form";
import HabitForm from "./habit-form";
import { BarChart3, Plus, Calendar, Quote, Target } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Chart: any;
  }
}

export default function AnalyticsSidebar() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<any>(null);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false);
  const [, setLocation] = useLocation();

  const { data: categories } = useQuery({
    queryKey: ["/api/analytics/categories"],
  });

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  const endDate = new Date();

  const { data: weeklyData } = useQuery({
    queryKey: ["/api/analytics/weekly-completions", {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }],
  });

  // Load Chart.js dynamically and create chart
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        initChart();
      };
      document.head.appendChild(script);
    } else if (window.Chart) {
      initChart();
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartRef.current, weeklyData]);

  const initChart = () => {
    if (chartRef.current && window.Chart && !chartInstance) {
      const ctx = chartRef.current.getContext('2d');
      
      // Process weekly data for chart
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const chartData = Array(7).fill(0);
      
      if (weeklyData) {
        weeklyData.forEach((item: { date: string; completions: number }) => {
          const date = new Date(item.date);
          const dayIndex = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
          chartData[dayIndex] = item.completions;
        });
      }

      const newChart = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: days,
          datasets: [{
            label: 'Completed Habits',
            data: chartData,
            backgroundColor: [
              '#3B82F6', '#10B981', '#3B82F6', '#F59E0B', 
              '#3B82F6', '#EF4444', '#10B981'
            ],
            borderRadius: 4,
            maxBarThickness: 20
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              display: false,
              beginAtZero: true,
              max: Math.max(10, Math.max(...chartData) + 2)
            },
            x: {
              display: false
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
      setChartInstance(newChart);
    }
  };

  const motivationalQuotes = [
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Excellence is not a skill, it's an attitude.", author: "Ralph Marston" },
    { text: "Progress, not perfection.", author: "Unknown" },
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const categoryColors = {
    health: "bg-emerald-500",
    learning: "bg-blue-500", 
    productivity: "bg-amber-500",
    personal: "bg-purple-500",
    general: "bg-slate-500",
  };

  return (
    <div className="space-y-6">
      {/* Weekly Progress Chart */}
      <Card className="shadow-sm border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-center">
            <canvas ref={chartRef} className="w-full h-full"></canvas>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </CardContent>
      </Card>

      {/* Habit Categories */}
      <Card className="shadow-sm border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">Habit Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {categories && categories.length > 0 ? (
            <div className="space-y-3">
              {categories.map((category: { category: string; count: number }) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      categoryColors[category.category as keyof typeof categoryColors] || categoryColors.general
                    }`}></div>
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {category.category === "health" ? "Health & Fitness" : category.category}
                    </span>
                  </div>
                  <span className="text-sm text-slate-600">{category.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-500 text-sm">No categories yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <Quote className="w-8 h-8 opacity-50 mx-auto mb-3" />
            <p className="text-sm font-medium mb-3">"{randomQuote.text}"</p>
            <p className="text-xs opacity-75">- {randomQuote.author}</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-sm border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Dialog open={isGoalFormOpen} onOpenChange={setIsGoalFormOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-colors p-3"
                >
                  <Plus className="w-4 h-4 mr-3 text-blue-600" />
                  <span className="font-medium text-slate-700">Add New Goal</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <GoalForm onSuccess={() => setIsGoalFormOpen(false)} />
              </DialogContent>
            </Dialog>

            <Dialog open={isHabitFormOpen} onOpenChange={setIsHabitFormOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 transition-colors p-3"
                >
                  <Calendar className="w-4 h-4 mr-3 text-emerald-600" />
                  <span className="font-medium text-slate-700">Add New Habit</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <HabitForm onSuccess={() => setIsHabitFormOpen(false)} />
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              className="w-full justify-start border-slate-200 hover:border-amber-200 hover:bg-amber-50 transition-colors p-3"
              onClick={() => setLocation("/analytics")}
            >
              <BarChart3 className="w-4 h-4 mr-3 text-amber-600" />
              <span className="font-medium text-slate-700">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
