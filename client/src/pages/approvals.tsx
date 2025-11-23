import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, MessageSquare, Clock, User, ChevronRight } from "lucide-react";

const mockApprovalQueue = [
  {
    id: "post_1",
    title: "AI Breakthrough Post",
    client: "TechStart Inc",
    platform: "LINKEDIN",
    caption: "We just launched our new AI-powered social media manager! Automate your content, save hours every week, and grow your audience faster than ever before. 🚀",
    submittedBy: "Mike Chen",
    submittedAt: "2025-11-23T14:30:00Z",
    status: "PENDING_APPROVAL",
    comments: [
      { author: "Sarah Johnson", role: "AGENCY_OWNER", text: "Love this! Just make sure the CTA is clear.", timestamp: "2025-11-23T15:00:00Z", avatar: "SJ" },
      { author: "Mike Chen", role: "SOCIAL_MANAGER", text: "Updated with better CTA. Check the preview 👆", timestamp: "2025-11-23T15:15:00Z", avatar: "MC" }
    ],
    revisions: [
      { version: 1, author: "Mike Chen", timestamp: "2025-11-23T14:30:00Z", caption: "Original version" },
      { version: 2, author: "Mike Chen", timestamp: "2025-11-23T15:15:00Z", caption: "Updated with CTA revision" }
    ]
  },
  {
    id: "post_2",
    title: "Summer Collection Launch",
    client: "Acme Corp",
    platform: "INSTAGRAM",
    caption: "Excited to announce our brand new summer collection! 🌞 Limited time offer - 20% off for early birds.",
    submittedBy: "Mike Chen",
    submittedAt: "2025-11-23T13:00:00Z",
    status: "PENDING_APPROVAL",
    comments: [],
    revisions: [
      { version: 1, author: "Mike Chen", timestamp: "2025-11-23T13:00:00Z", caption: "Initial draft" }
    ]
  },
  {
    id: "post_3",
    title: "Q4 Performance Report",
    client: "Bloom Bakery",
    platform: "INSTAGRAM",
    caption: "Our best quarter yet! Thanks to all our loyal customers 💕",
    submittedBy: "Sarah Johnson",
    submittedAt: "2025-11-22T10:00:00Z",
    status: "PENDING_APPROVAL",
    comments: [
      { author: "Sarah Johnson", role: "AGENCY_OWNER", text: "Can we add specific numbers?", timestamp: "2025-11-22T10:30:00Z", avatar: "SJ" }
    ],
    revisions: [
      { version: 1, author: "Sarah Johnson", timestamp: "2025-11-22T10:00:00Z", caption: "Initial" }
    ]
  }
];

export default function Approvals() {
  const [selectedPost, setSelectedPost] = useState(mockApprovalQueue[0]);
  const [comment, setComment] = useState("");

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approval Queue</h1>
          <p className="text-muted-foreground mt-1">{mockApprovalQueue.length} posts awaiting review</p>
        </div>
        <Badge className="bg-amber-500/15 text-amber-600 border-amber-200">{mockApprovalQueue.length} Pending</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-12rem)]">
        {/* Queue List */}
        <div className="col-span-1 flex flex-col gap-2 border rounded-lg bg-muted/30 p-3 overflow-y-auto">
          <h3 className="font-semibold text-sm px-2 sticky top-0 bg-background/80 backdrop-blur py-2">Posts Pending Review</h3>
          {mockApprovalQueue.map((post) => (
            <button
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className={`text-left p-3 rounded-lg border transition-all ${
                selectedPost.id === post.id
                  ? "bg-primary/10 border-primary shadow-sm"
                  : "bg-background hover:bg-muted border-border/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{post.client}</p>
                </div>
                <Badge variant="outline" className="shrink-0 text-xs">
                  {post.platform}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <Clock className="inline h-3 w-3 mr-1" />
                {Math.floor((Date.now() - new Date(post.submittedAt).getTime()) / 3600000)}h ago
              </p>
            </button>
          ))}
        </div>

        {/* Detail View */}
        <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
          <Card className="glass-card flex-1 flex flex-col overflow-hidden">
            <CardHeader className="shrink-0 pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedPost.title}</CardTitle>
                  <CardDescription className="mt-1">{selectedPost.client} • {selectedPost.platform}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600">
                  {selectedPost.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4">
              {/* Post Preview */}
              <div className="border rounded-lg p-4 bg-muted/20">
                <p className="text-sm whitespace-pre-wrap">{selectedPost.caption}</p>
              </div>

              {/* Revision History */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Revision History</h4>
                <div className="space-y-2">
                  {selectedPost.revisions.map((rev) => (
                    <div key={rev.version} className="text-xs p-2 rounded bg-secondary/50 flex items-center justify-between">
                      <span>v{rev.version} by {rev.author}</span>
                      <span className="text-muted-foreground">{new Date(rev.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comments Thread */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" /> Comments ({selectedPost.comments.length})
                </h4>
                <div className="space-y-3">
                  {selectedPost.comments.map((c, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/20 border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-6 w-6 text-xs">
                          <AvatarFallback>{c.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold">{c.author}</span>
                        <Badge variant="outline" className="text-xs">{c.role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(c.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Comment */}
              <div className="mt-auto pt-4 border-t">
                <label className="text-sm font-medium mb-2 block">Add Comment</label>
                <Textarea
                  placeholder="Request changes or approve with notes..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-2 min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-1" /> Comment Only
                  </Button>
                  <Button size="sm" className="flex-1 bg-destructive hover:bg-destructive/90">
                    <X className="h-4 w-4 mr-1" /> Request Changes
                  </Button>
                  <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <Check className="h-4 w-4 mr-1" /> Approve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
