import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Save, Lock, Bell, Users, Zap, CreditCard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Settings() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your agency settings, brand, and account preferences.</p>
      </div>

      <Tabs defaultValue="organization" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Organization Settings */}
        <TabsContent value="organization" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Agency Details</CardTitle>
              <CardDescription>Update your organization information and branding.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Agency Name</Label>
                  <Input value="Digital Agency Pro" />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input value="digital-agency-pro" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Website</Label>
                <Input placeholder="https://youragency.com" />
              </div>

              <Separator className="my-4" />
              <h3 className="font-semibold text-sm">White-Label Branding</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 rounded-lg">
                      <AvatarImage src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop" />
                      <AvatarFallback>DA</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">
                      <Upload className="mr-2 h-4 w-4" /> Upload Logo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-md bg-primary" />
                      <Input value="#6b46c1" className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-md bg-[#f43f5e]" />
                      <Input value="#f43f5e" className="flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-md bg-blue-500" />
                      <Input value="#3b82f6" className="flex-1" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Custom Domain (Enterprise)</Label>
                  <Input placeholder="dashboard.youragency.com" />
                  <p className="text-xs text-muted-foreground">Point your domain's DNS to configure white-label portal</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-primary hover:opacity-90">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Settings */}
        <TabsContent value="team" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage users and their access levels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {[
                  { name: "Sarah Johnson", email: "admin@agencypro.com", role: "AGENCY_OWNER", status: "Active" },
                  { name: "Mike Chen", email: "manager@agencypro.com", role: "SOCIAL_MANAGER", status: "Active" },
                  { name: "Emma Smith", email: "reviewer@agencypro.com", role: "CLIENT_REVIEWER", status: "Pending" }
                ].map((member) => (
                  <div key={member.email} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/10">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{member.role.replace('_', ' ')}</Badge>
                      <Badge variant={member.status === 'Active' ? 'default' : 'secondary'} className={member.status === 'Active' ? 'bg-emerald-500/15 text-emerald-600' : ''}>
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full">
                <Users className="mr-2 h-4 w-4" /> Invite Team Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Current plan and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
                <div>
                  <h3 className="font-semibold">Enterprise Plan</h3>
                  <p className="text-sm text-muted-foreground">Unlimited clients, AI credits, advanced reporting</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">$299</p>
                  <p className="text-xs text-muted-foreground">per month</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Generation Credits</span>
                  <span className="font-semibold">12,450 / 15,000</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[83%]" />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm">Next Billing Date</span>
                  <span className="font-medium">December 23, 2025</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                <CreditCard className="mr-2 h-4 w-4" /> Update Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Usage & Overages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">LLM Tokens Used</p>
                  <p className="text-2xl font-bold mt-1">12.4K</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Images Generated</p>
                  <p className="text-2xl font-bold mt-1">24</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Video Minutes</p>
                  <p className="text-2xl font-bold mt-1">45m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Password & Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Lock className="mr-2 h-4 w-4" /> Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Enable Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API keys for integrations and webhooks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/10">
                <div>
                  <p className="text-sm font-medium">prod_key_abc123</p>
                  <p className="text-xs text-muted-foreground">Created Dec 2024</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <Button variant="outline" className="w-full">
                <Zap className="mr-2 h-4 w-4" /> Generate New API Key
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email on posting failures</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Daily digest of analytics</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">New client approval alerts</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
