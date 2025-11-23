import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Clients() {
  const clients = [
    {
      id: 1,
      name: "Acme Corp",
      industry: "Retail",
      status: "Active",
      platforms: ["instagram", "facebook", "twitter"],
      posts: 12,
      credits: 450,
      avatar: "AC"
    },
    {
      id: 2,
      name: "TechStart Inc",
      industry: "SaaS",
      status: "Active",
      platforms: ["linkedin", "twitter"],
      posts: 8,
      credits: 120,
      avatar: "TS"
    },
    {
      id: 3,
      name: "Bloom Bakery",
      industry: "Food & Bev",
      status: "Pending",
      platforms: ["instagram", "facebook"],
      posts: 0,
      credits: 0,
      avatar: "BB"
    },
    {
      id: 4,
      name: "Elevate Fitness",
      industry: "Health",
      status: "Active",
      platforms: ["instagram", "youtube"],
      posts: 24,
      credits: 890,
      avatar: "EF"
    },
  ];

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case "instagram": return <Instagram className="h-4 w-4" />;
      case "facebook": return <Facebook className="h-4 w-4" />;
      case "twitter": return <Twitter className="h-4 w-4" />;
      case "linkedin": return <Linkedin className="h-4 w-4" />;
      case "youtube": return <Youtube className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your client organizations and access.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
             <CardTitle>All Clients</CardTitle>
             <div className="relative w-64">
               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input placeholder="Search clients..." className="pl-8" />
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Connected Platforms</TableHead>
                <TableHead className="text-right">Activity (30d)</TableHead>
                <TableHead className="text-right">AI Usage</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-primary/10 text-primary">
                        <AvatarFallback>{client.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{client.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{client.industry}</TableCell>
                  <TableCell>
                    <Badge variant={client.status === "Active" ? "default" : "secondary"} className={client.status === "Active" ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200 shadow-none" : ""}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {client.platforms.map((p) => (
                        <div key={p} className="bg-secondary p-1.5 rounded-md text-muted-foreground">
                          {getPlatformIcon(p)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{client.posts} posts</TableCell>
                  <TableCell className="text-right text-muted-foreground">{client.credits} credits</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Dashboard</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
