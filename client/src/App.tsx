import { Switch, Route } from "wouter";
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

function Router() {
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
