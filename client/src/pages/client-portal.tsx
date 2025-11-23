import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CheckCircle2, AlertCircle, Eye, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";

// Client Portal - White-label view for clients
export default function ClientPortal() {
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient] = useState("client_1");

  useEffect(() => {
    const loadClientData = async () => {
      try {
        setIsLoading(true);
        const [scheduleRes, approvalsRes] = await Promise.all([
          api.clients.getClientSchedule(selectedClient),
          api.clients.getClientApprovals(selectedClient)
        ]);

        if (scheduleRes.success) {
          setScheduledPosts(scheduleRes.data.scheduledPosts);
        }
        if (approvalsRes.success) {
          setPendingApprovals(approvalsRes.data.pending);
        }
      } catch (error) {
        console.error("Failed to load client data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClientData();
  }, [selectedClient]);

  const brandSettings = {
    logoUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop",
    primaryColor: "#6b46c1",
    companyName: "Acme Corp",
    domain: "acmecorp.agencysocial.ai"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-border/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={brandSettings.logoUrl} alt="Logo" className="h-10 w-10 rounded-lg" />
            <div>
              <h1 className="font-bold text-lg">{brandSettings.companyName}</h1>
              <p className="text-xs text-muted-foreground">Social Media Dashboard</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Managed by</p>
            <p className="font-semibold text-sm">Digital Agency Pro</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="glass-card border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Scheduled Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{scheduledPosts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">For the next 30 days</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-purple-200/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{pendingApprovals.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting your review</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-emerald-200/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Agency Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold">24/7 Available</p>
              <p className="text-xs text-muted-foreground mt-1">Email or chat support</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="scheduled" className="w-full">
          <TabsList>
            <TabsTrigger value="scheduled">Scheduled Posts ({scheduledPosts.length})</TabsTrigger>
            <TabsTrigger value="approvals">
              Awaiting Approval ({pendingApprovals.length})
            </TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          {/* Scheduled Posts */}
          <TabsContent value="scheduled" className="space-y-4 mt-4">
            {isLoading ? (
              <Card className="glass-card">
                <CardContent className="pt-6">Loading...</CardContent>
              </Card>
            ) : scheduledPosts.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="pt-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="font-semibold">No scheduled posts</p>
                  <p className="text-sm text-muted-foreground">Your agency will schedule posts here</p>
                </CardContent>
              </Card>
            ) : (
              scheduledPosts.map((post: any) => (
                <Card key={post.id} className="glass-card border-blue-200/30 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {post.platform}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.scheduledAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className="bg-blue-500/15 text-blue-600">Scheduled</Badge>
                        <Button size="icon" variant="outline" className="h-9 w-9">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Awaiting Approval */}
          <TabsContent value="approvals" className="space-y-4 mt-4">
            {isLoading ? (
              <Card className="glass-card">
                <CardContent className="pt-6">Loading...</CardContent>
              </Card>
            ) : pendingApprovals.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="pt-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                  <p className="font-semibold">All caught up!</p>
                  <p className="text-sm text-muted-foreground">No posts awaiting your review</p>
                </CardContent>
              </Card>
            ) : (
              pendingApprovals.map((post: any) => (
                <Card key={post.id} className="glass-card border-amber-200/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{post.platform}</p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Submitted {new Date(post.submittedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className="bg-amber-500/15 text-amber-600">Pending</Badge>
                        <Button className="bg-primary hover:opacity-90">Review</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Activity */}
          <TabsContent value="activity" className="space-y-4 mt-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    action: "Post Published",
                    post: "Summer Collection Launch",
                    platform: "Instagram",
                    time: "2 hours ago",
                    icon: "✅",
                    color: "text-emerald-600"
                  },
                  {
                    action: "Post Scheduled",
                    post: "Behind the Scenes",
                    platform: "Instagram",
                    time: "5 hours ago",
                    icon: "📅",
                    color: "text-blue-600"
                  },
                  {
                    action: "Approval Requested",
                    post: "Product Showcase",
                    platform: "Facebook",
                    time: "1 day ago",
                    icon: "📝",
                    color: "text-purple-600"
                  }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 pb-3 last:pb-0 border-b border-border/50 last:border-0">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.post} • {activity.platform}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Support Card */}
        <Card className="glass-card border-primary/30 bg-gradient-to-r from-primary/5 to-purple-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Contact your agency manager or email support@agencysocial.ai
                </p>
              </div>
              <Button variant="outline">Contact Support</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
