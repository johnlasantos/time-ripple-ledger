
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Clock, User, Users, BarChart, LogOut } from "lucide-react";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  isAdmin?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title, 
  description,
  isAdmin = false
}) => {
  const navigate = useNavigate();
  
  // This would be replaced with actual auth logic once Supabase is integrated
  const handleLogout = () => {
    console.log("Logout clicked - this would log the user out");
    // Will implement with Supabase later
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 bg-sidebar-background text-sidebar-foreground border-r">
          <div className="flex flex-col h-full p-4">
            <div className="mb-8 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-primary" />
              <h1 className="text-xl font-bold">TimeBank</h1>
            </div>
            
            <nav className="space-y-1 flex-1">
              <Link 
                to="/"
                className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <BarChart className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              
              {isAdmin && (
                <Link 
                  to="/users"
                  className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Link>
              )}
              
              <Link 
                to="/profile"
                className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Link>
            </nav>
            
            <div className="mt-auto pt-4 border-t">
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full flex items-center justify-start text-sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
            <div className="container flex h-16 items-center px-4">
              <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
              </div>
              <div className="ml-auto flex items-center space-x-4">
                {/* This will be replaced with the actual user info */}
                <span className="text-sm">User Name (simulated)</span>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>
          </header>
          
          <main className="container px-4 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
