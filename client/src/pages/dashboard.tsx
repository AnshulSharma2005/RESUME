import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { currentUser, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !currentUser) {
      setLocation("/");
    }
  }, [currentUser, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect to home
  }

  return <UserDashboard />;
}
