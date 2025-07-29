import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Target, BarChart3, Calendar, TrendingUp, LogOut, Settings } from "lucide-react";

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/goals", label: "Goals", icon: Target },
    { path: "/habits", label: "Habits", icon: Calendar },
    { path: "/analytics", label: "Analytics", icon: TrendingUp },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200 h-full flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Target className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">StriveHub</h1>
            <p className="text-sm text-slate-500">Goal & Habit Tracker</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex items-center space-x-3 p-3 rounded-lg w-full text-left font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
          {user?.profileImageUrl ? (
            <img 
              src={user.profileImageUrl} 
              alt="User profile" 
              className="w-10 h-10 rounded-full object-cover" 
            />
          ) : (
            <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
              <span className="text-slate-600 font-medium">
                {user?.firstName?.[0] || user?.email?.[0] || "U"}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-800 truncate">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.email || "User"}
            </p>
            <p className="text-sm text-slate-500 truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.href = "/api/logout"}
            className="text-slate-400 hover:text-slate-600"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
