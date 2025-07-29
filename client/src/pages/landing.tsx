import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Calendar, BarChart3 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Target className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">StriveHub</h1>
              <p className="text-slate-600">Personal Goal & Habit Tracker</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Transform Your Goals Into Reality
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Track your progress, build lasting habits, and achieve your dreams with our comprehensive goal-setting platform.
          </p>
          
          <Button 
            onClick={() => window.location.href = "/api/login"}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium transition-colors duration-200"
          >
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Set Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create meaningful goals with deadlines and track your progress towards achieving them.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <Calendar className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <CardTitle>Daily Habits</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Build powerful daily habits and maintain streaks to create lasting positive change.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <CardTitle>Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your journey with detailed progress tracking and completion analytics.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gain insights with comprehensive analytics and visualizations of your performance.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Start Your Journey?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of users who have transformed their lives with StriveHub.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
              >
                Sign In to Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
