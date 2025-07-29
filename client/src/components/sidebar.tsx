import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Target, Calendar, BarChart3, LogOut } from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Goals", href: "/goals", icon: Target },
    { name: "Habits", href: "/habits", icon: Calendar },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-full w-64 bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="flex items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Target className="text-white text-sm" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">StriveHub</h1>
          </div>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      <Separator />

      {/* User Profile */}
      <div className="p-4">
        {user && (
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profileImageUrl || ""} />
              <AvatarFallback>
                {user.firstName?.[0] || user.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {user.firstName || user.email}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-600 hover:text-slate-900"
          onClick={() => window.location.href = "/api/logout"}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}