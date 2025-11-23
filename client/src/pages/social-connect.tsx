import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, CheckCircle2, Clock, AlertCircle, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const socialPlatforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: "📷",
    color: "from-pink-400 to-rose-500",
    description: "Connect Instagram business accounts",
    connected: true,
    accounts: [
      { username: "acmecorp", followers: 45000, status: "active" },
      { username: "techstart_official", followers: 12500, status: "active" }
    ]
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "f",
    color: "from-blue-600 to-blue-500",
    description: "Connect Facebook pages and groups",
    connected: true,
    accounts: [
      { username: "Acme Corp", followers: 120000, status: "active" }
    ]
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "in",
    color: "from-blue-700 to-blue-600",
    description: "Connect LinkedIn company pages",
    connected: true,
    accounts: [
      { username: "TechStart Inc", followers: 12500, status: "active" }
    ]
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: "𝕏",
    color: "from-gray-900 to-black",
    description: "Connect X accounts",
    connected: false,
    accounts: []
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "♪",
    color: "from-black to-gray-800",
    description: "Connect TikTok creator accounts",
    connected: false,
    accounts: []
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "▶",
    color: "from-red-600 to-red-500",
    description: "Connect YouTube channels",
    connected: true,
    accounts: [
      { username: "Elevate Fitness", followers: 156000, status: "active" }
    ]
  }
];

export default function SocialConnect() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showOAuthDialog, setShowOAuthDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState("client_1");

  const platform = selectedPlatform ? socialPlatforms.find(p => p.id === selectedPlatform) : null;

  const handleOAuthClick = () => {
    setShowOAuthDialog(true);
    // In production, this would redirect to the OAuth provider
    setTimeout(() => {
      setShowOAuthDialog(false);
      alert("OAuth flow simulated - In production, you'd be redirected to the platform's login");
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Social Media Connections</h1>
        <p className="text-muted-foreground mt-1">Connect and manage social media accounts for your clients.</p>
      </div>

      {/* Client Filter */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Select Client:</label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-[250px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client_1">Acme Corp</SelectItem>
                <SelectItem value="client_2">TechStart Inc</SelectItem>
                <SelectItem value="client_3">Bloom Bakery</SelectItem>
                <SelectItem value="client_4">Elevate Fitness</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Platforms Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {socialPlatforms.map(plat => (
          <Card
            key={plat.id}
            className={`glass-card cursor-pointer transition-all hover:shadow-lg ${
              selectedPlatform === plat.id ? "ring-2 ring-primary shadow-lg" : ""
            }`}
            onClick={() => setSelectedPlatform(plat.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">{plat.icon}</span>
                    {plat.name}
                  </CardTitle>
                  <CardDescription className="mt-1">{plat.description}</CardDescription>
                </div>
                {plat.connected && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                )}
              </div>
            </CardHeader>

            <CardContent>
              {plat.accounts.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Connected Accounts:</p>
                  {plat.accounts.map((acc) => (
                    <div key={acc.username} className="p-2 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">@{acc.username}</span>
                        <Badge variant="outline" className="text-xs">{acc.followers.toLocaleString()} followers</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                        <CheckCircle2 className="h-3 w-3" /> Connected
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-3 text-xs">
                    <ArrowRight className="mr-1 h-3 w-3" /> Add Another Account
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No accounts connected</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to connect</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Panel */}
      {platform && (
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="text-4xl">{platform.icon}</span>
                {platform.name} - {selectedClient === "client_1" ? "Acme Corp" : selectedClient === "client_2" ? "TechStart Inc" : selectedClient === "client_3" ? "Bloom Bakery" : "Elevate Fitness"}
              </CardTitle>
              {platform.connected && <Badge className="bg-emerald-500">Connected</Badge>}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {platform.accounts.length > 0 ? (
              <>
                <div>
                  <h4 className="text-sm font-semibold mb-3">Connected Accounts</h4>
                  <div className="space-y-3">
                    {platform.accounts.map((acc) => (
                      <div key={acc.username} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-all">
                        <div>
                          <p className="font-medium">@{acc.username}</p>
                          <p className="text-sm text-muted-foreground">{acc.followers.toLocaleString()} followers</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-emerald-600">
                            <Clock className="h-3 w-3 mr-1" /> Active
                          </Badge>
                          <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10">
                            <LogOut className="h-4 w-4 mr-1" /> Disconnect
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleOAuthClick} className="w-full bg-primary hover:opacity-90">
                  <ArrowRight className="mr-2 h-4 w-4" /> Add Another {platform.name} Account
                </Button>
              </>
            ) : (
              <>
                <div className="p-6 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 text-center">
                  <span className="text-5xl block mb-2">{platform.icon}</span>
                  <h3 className="font-semibold mb-1">No accounts connected yet</h3>
                  <p className="text-sm text-muted-foreground">Connect a {platform.name} account to schedule posts and manage content</p>
                </div>

                <Button onClick={handleOAuthClick} className="w-full bg-primary hover:opacity-90" size="lg">
                  <ArrowRight className="mr-2 h-4 w-4" /> Connect {platform.name} Account
                </Button>
              </>
            )}

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 text-sm text-blue-700">
              <p><strong>🔒 Security Note:</strong> Your account tokens are encrypted and never shared. We only request the minimum permissions needed.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* OAuth Dialog */}
      <Dialog open={showOAuthDialog} onOpenChange={setShowOAuthDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connecting {platform?.name}...</DialogTitle>
            <DialogDescription>Redirecting to {platform?.name} login</DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">You'll be redirected to authorize access in a new window</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
