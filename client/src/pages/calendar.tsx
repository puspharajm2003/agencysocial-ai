import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Calendar() {
  // Mock days
  const days = Array.from({ length: 35 }, (_, i) => {
    const day = i + 1;
    const posts = [];
    if (day === 4 || day === 12 || day === 24) {
      posts.push({ id: 1, client: "Acme", platform: "instagram", status: "scheduled", time: "10:00 AM" });
    }
    if (day === 12) {
      posts.push({ id: 2, client: "TechStart", platform: "linkedin", status: "draft", time: "2:00 PM" });
    }
    return { day: day <= 30 ? day : null, posts };
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 h-[calc(100vh-4rem)] overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage posts across all clients.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center border rounded-md">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none rounded-l-md">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none rounded-r-md">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Post
          </Button>
        </div>
      </div>

      <Card className="flex-1 glass-card overflow-hidden flex flex-col">
        <CardHeader className="pb-2 shrink-0">
          <div className="flex items-center justify-between">
             <CardTitle className="text-lg">November 2025</CardTitle>
             <div className="flex gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Published</Badge>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Scheduled</Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">Draft</Badge>
             </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 flex flex-col min-h-0">
          <div className="grid grid-cols-7 border-b">
            {weekDays.map((d) => (
              <div key={d} className="p-2 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-5 flex-1 min-h-0">
            {days.map((d, i) => (
              <div key={i} className="border-r border-b last:border-r-0 p-2 relative group hover:bg-muted/30 transition-colors min-h-[100px]">
                {d.day && (
                  <>
                    <span className={`text-sm font-medium ${d.day === 23 ? "bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center rounded-full" : "text-muted-foreground"}`}>
                      {d.day}
                    </span>
                    <div className="mt-2 space-y-1.5 overflow-y-auto max-h-[calc(100%-2rem)]">
                      {d.posts.map((post) => (
                        <div key={post.id} className={`text-xs p-1.5 rounded border truncate cursor-pointer hover:scale-[1.02] transition-transform
                          ${post.status === 'scheduled' ? 'bg-blue-500/10 border-blue-200 text-blue-700' : 'bg-amber-500/10 border-amber-200 text-amber-700'}
                        `}>
                          <span className="font-semibold">{post.time}</span> {post.client}
                        </div>
                      ))}
                    </div>
                    <Button size="icon" variant="ghost" className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
