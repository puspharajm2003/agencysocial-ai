import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Save, Send, Trash2, Eye, Share2, AlertCircle, CheckCircle2, ImageIcon, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DraftEditor() {
  const [draft, setDraft] = useState({
    id: "draft_001",
    title: "Summer Product Launch",
    caption: "Excited to announce our brand new summer collection! 🌞 Limited time offer - 20% off for early birds. Tap the link in bio to shop now! #Summer #NewArrivals",
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop", alt: "Summer collection hero" }
    ],
    platform: "instagram",
    client: "acme",
    status: "DRAFT",
    scheduledAt: "2025-11-25T10:00:00Z",
    hashtags: ["#Summer", "#NewArrivals", "#Fashion"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("2025-11-25");
  const [scheduleTime, setScheduleTime] = useState("10:00");
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  const handleSaveDraft = () => {
    alert("Draft saved! (In production, this would save to your database)");
  };

  const handleSchedulePost = () => {
    setDraft(prev => ({
      ...prev,
      status: "SCHEDULED",
      scheduledAt: `${scheduleDate}T${scheduleTime}:00Z`,
      updatedAt: new Date().toISOString()
    }));
    setShowScheduleDialog(false);
    alert("Post scheduled!");
  };

  const handleSendForApproval = () => {
    setDraft(prev => ({
      ...prev,
      status: "PENDING_APPROVAL",
      updatedAt: new Date().toISOString()
    }));
    alert("Post sent for approval!");
  };

  const platformEmojis = {
    instagram: "📷",
    facebook: "f",
    linkedin: "in",
    twitter: "𝕏",
    tiktok: "♪",
    youtube: "▶"
  };

  const platformColors = {
    instagram: "from-pink-400 to-rose-500",
    facebook: "from-blue-600 to-blue-500",
    linkedin: "from-blue-700 to-blue-600",
    twitter: "from-black to-gray-800",
    tiktok: "from-black to-gray-700",
    youtube: "from-red-600 to-red-500"
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-6xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Draft Editor</h1>
          <p className="text-muted-foreground mt-1">Create and schedule posts across platforms</p>
        </div>
        <Badge className={`bg-gradient-to-r ${platformColors[draft.platform as keyof typeof platformColors]}`}>
          {platformEmojis[draft.platform as keyof typeof platformEmojis]} {draft.platform.toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {draft.status === "DRAFT" && <AlertCircle className="h-5 w-5 text-amber-500" />}
              {draft.status === "SCHEDULED" && <Calendar className="h-5 w-5 text-blue-500" />}
              {draft.status === "PENDING_APPROVAL" && <Clock className="h-5 w-5 text-purple-500" />}
              <span className="font-semibold text-lg">{draft.status.replace('_', ' ')}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Client</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-lg">Acme Corp</p>
            <p className="text-xs text-muted-foreground">acme_corp</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-sm">Nov 23, 2025</p>
            <p className="text-xs text-muted-foreground">2:30 PM</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-lg capitalize">{draft.platform}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Post Title (Internal)</Label>
                <Input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="e.g., Summer Collection Launch"
                />
              </div>

              <div className="space-y-2">
                <Label>Caption</Label>
                <Textarea
                  value={draft.caption}
                  onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  {draft.caption.length} characters
                  {draft.platform === "twitter" && draft.caption.length > 280 && (
                    <span className="text-destructive ml-2">⚠️ Exceeds 280 character limit</span>
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Media</Label>
                <div className="grid grid-cols-2 gap-3">
                  {draft.images.map((img) => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border/50 aspect-square">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <button className="rounded-lg border-2 border-dashed border-border/50 hover:border-primary transition-colors flex items-center justify-center aspect-square">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hashtags</Label>
                <div className="flex flex-wrap gap-2">
                  {draft.hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:opacity-70">
                      {tag}
                      <button className="ml-1 hover:opacity-70">×</button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Platform Preview</CardTitle>
              <CardDescription>How this post will appear</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Instagram Preview */}
              {draft.platform === "instagram" && (
                <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-black/10">
                  <div className="bg-white px-4 py-3 border-b border-black/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500" />
                      <span className="text-sm font-semibold">acme_corp</span>
                    </div>
                    <span className="text-2xl">⋯</span>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-primary/10 to-purple-500/10">
                    {draft.images[0] && <img src={draft.images[0].url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    <div className="flex gap-2">
                      <button className="text-2xl">❤️</button>
                      <button className="text-2xl">💬</button>
                      <button className="text-2xl">✈️</button>
                    </div>
                    <p className="text-sm"><span className="font-semibold">acme_corp</span> {draft.caption}</p>
                  </div>
                </div>
              )}

              {/* Twitter Preview */}
              {draft.platform === "twitter" && (
                <div className="max-w-sm mx-auto bg-black text-white rounded-lg border border-gray-700 overflow-hidden p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
                    <div>
                      <p className="font-bold text-sm">Acme Corp</p>
                      <p className="text-xs text-gray-500">@acme_corp</p>
                    </div>
                  </div>
                  <p className="text-base mb-3">{draft.caption}</p>
                  {draft.images[0] && <img src={draft.images[0].url} alt="" className="rounded-lg w-full mb-3" />}
                  <div className="flex gap-8 text-gray-500 text-xs pt-3 border-t border-gray-700">
                    <span>💬 123</span>
                    <span>🔄 456</span>
                    <span>❤️ 789</span>
                  </div>
                </div>
              )}

              {/* LinkedIn Preview */}
              {draft.platform === "linkedin" && (
                <div className="max-w-sm mx-auto bg-white rounded-lg border border-gray-300 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-blue-600" />
                      <div>
                        <p className="text-sm font-semibold">Acme Corp</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900">{draft.caption}</p>
                  </div>
                  {draft.images[0] && <img src={draft.images[0].url} alt="" className="w-full" />}
                  <div className="px-4 py-2 border-t border-gray-300 flex gap-4 text-xs text-gray-600">
                    <span>👍 245</span>
                    <span>💬 67</span>
                    <span>↗️ 23</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">Current Version (v1)</span>
                    <Badge>Latest</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Modified 2m ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 sticky bottom-4">
        <div className="text-xs text-muted-foreground">
          Last saved: {new Date(draft.updatedAt).toLocaleString()}
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          {draft.status === "DRAFT" && (
            <>
              <Button onClick={() => setShowScheduleDialog(true)}>
                <Calendar className="mr-2 h-4 w-4" /> Schedule
              </Button>
              <Button onClick={handleSendForApproval} className="bg-purple-600 hover:bg-purple-700">
                <Send className="mr-2 h-4 w-4" /> Send for Approval
              </Button>
            </>
          )}
          {draft.status === "SCHEDULED" && (
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Scheduled for {new Date(draft.scheduledAt).toLocaleDateString()}
            </Button>
          )}
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Post will be published on {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSchedulePost} className="bg-primary">
                Schedule Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
