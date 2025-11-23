import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Zap, MoreHorizontal, Plus, ArrowUpRight, CheckCircle2, Sparkles, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your agency performance and client activities.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Client
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-emerald-500 flex items-center mr-1 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" /> +2
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across 8 platforms
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Credits</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground mt-1">
              12,450 / 15,000 used
            </p>
            <div className="h-1 w-full bg-secondary mt-3 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[84%]" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires client review
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions across your client portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { client: "Acme Corp", action: "Post approved by client", time: "2m ago", avatar: "AC" },
                { client: "TechStart", action: "AI Caption generated", time: "15m ago", avatar: "TS" },
                { client: "Bakery & Co", action: "Scheduled 3 posts for Instagram", time: "1h ago", avatar: "BC" },
                { client: "Fashion Brand", action: "New asset uploaded", time: "3h ago", avatar: "FB" },
                { client: "Acme Corp", action: "Monthly report generated", time: "5h ago", avatar: "AC" },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{item.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.action}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground">{item.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 glass-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for agency managers.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline" className="h-auto py-4 justify-start px-4" asChild>
              <Link href="/content-studio">
                <Sparkles className="mr-4 h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-semibold">Generate Content</div>
                  <div className="text-xs text-muted-foreground">Create captions & images with AI</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 justify-start px-4">
              <Users className="mr-4 h-5 w-5 text-blue-500" />
              <div className="text-left">
                <div className="font-semibold">Onboard Client</div>
                <div className="text-xs text-muted-foreground">Send invite link & setup branding</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4 justify-start px-4">
              <BarChart3 className="mr-4 h-5 w-5 text-green-500" />
              <div className="text-left">
                <div className="font-semibold">Export Reports</div>
                <div className="text-xs text-muted-foreground">Download PDF summaries</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
