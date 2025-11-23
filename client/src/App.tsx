import { Switch, Route } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/dashboard";
import ContentStudio from "@/pages/content-studio";
import Clients from "@/pages/clients";
import Calendar from "@/pages/calendar";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import Approvals from "@/pages/approvals";
import Assets from "@/pages/assets";
import Templates from "@/pages/templates";
import Onboarding from "@/pages/onboarding";
import SocialConnect from "@/pages/social-connect";
import DraftEditor from "@/pages/draft-editor";
import ClientPortal from "@/pages/client-portal";
import APIDebug from "@/pages/api-debug";
import Login from "@/pages/login";
import Signup from "@/pages/signup";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route component={Login} />
      </Switch>
    );
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/content-studio" component={ContentStudio} />
        <Route path="/clients" component={Clients} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/settings" component={Settings} />
        <Route path="/approvals" component={Approvals} />
        <Route path="/assets" component={Assets} />
        <Route path="/templates" component={Templates} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/social-connect" component={SocialConnect} />
        <Route path="/draft/:id" component={DraftEditor} />
        <Route path="/client-portal" component={ClientPortal} />
        <Route path="/api-debug" component={APIDebug} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
