import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Search, Trash2, Download, Tag, Folder, Grid3x3, List, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const mockAssets = [
  { id: 1, name: "summer-collection-hero.jpg", size: 2.4, type: "image", tags: ["summer", "collection", "hero"], date: "2025-11-20", client: "Acme Corp" },
  { id: 2, name: "product-showcase.png", size: 1.8, type: "image", tags: ["product", "showcase"], date: "2025-11-19", client: "Acme Corp" },
  { id: 3, name: "team-photo.jpg", size: 3.2, type: "image", tags: ["team", "company"], date: "2025-11-18", client: "TechStart" },
  { id: 4, name: "ai-explainer.mp4", size: 45.6, type: "video", tags: ["explainer", "ai"], date: "2025-11-17", client: "TechStart" },
  { id: 5, name: "bakery-interior.jpg", size: 2.9, type: "image", tags: ["bakery", "interior", "ambiance"], date: "2025-11-16", client: "Bloom Bakery" },
  { id: 6, name: "fitness-transformation.mp4", size: 78.3, type: "video", tags: ["fitness", "transformation"], date: "2025-11-15", client: "Elevate Fitness" },
  { id: 7, name: "social-media-guide.pdf", size: 5.2, type: "document", tags: ["guide", "social"], date: "2025-11-14", client: "All" },
  { id: 8, name: "brand-colors.png", size: 1.1, type: "image", tags: ["brand", "colors"], date: "2025-11-13", client: "All" }
];

export default function Assets() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);

  const allTags = Array.from(new Set(mockAssets.flatMap(a => a.tags)));
  
  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => asset.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleAsset = (id: number) => {
    setSelectedAssets(prev =>
      prev.includes(id)
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asset Library</h1>
          <p className="text-muted-foreground mt-1">{filteredAssets.length} assets across {new Set(mockAssets.map(a => a.client)).size} clients</p>
        </div>
        <Button className="bg-primary hover:opacity-90">
          <Upload className="mr-2 h-4 w-4" /> Upload Asset
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {/* Sidebar */}
        <Card className="glass-card h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Tags</p>
              <div className="flex flex-wrap gap-1">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => toggleTag(tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" /> {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Type</p>
              <div className="space-y-1">
                {["All", "Images", "Videos", "Documents"].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Client</p>
              <div className="space-y-1">
                {Array.from(new Set(mockAssets.map(a => a.client))).map(client => (
                  <label key={client} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox />
                    {client}
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="col-span-3 space-y-4">
          {/* Search & Tools */}
          <Card className="glass-card">
            <CardContent className="pt-6 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border-none bg-transparent"
              />
              <Button variant="ghost" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
              </Button>
              {selectedAssets.length > 0 && (
                <>
                  <Button variant="outline" size="sm">
                    <Download className="mr-1 h-4 w-4" /> Download ({selectedAssets.length})
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="mr-1 h-4 w-4" /> Delete
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Assets Grid */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssets.map(asset => (
                <Card key={asset.id} className="glass-card overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                  <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-purple-500/20 transition-all">
                    <div className="absolute top-2 right-2">
                      <Checkbox
                        checked={selectedAssets.includes(asset.id)}
                        onChange={() => toggleAsset(asset.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {asset.type === "video" && <span className="text-3xl">🎬</span>}
                    {asset.type === "image" && <span className="text-3xl">🖼️</span>}
                    {asset.type === "document" && <span className="text-3xl">📄</span>}
                  </div>
                  <CardContent className="pt-3">
                    <p className="text-sm font-medium truncate">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.size} MB</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {asset.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                      {asset.tags.length > 2 && <Badge variant="secondary" className="text-xs">+{asset.tags.length - 2}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-card">
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {filteredAssets.map(asset => (
                    <div key={asset.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 border border-border/50">
                      <Checkbox
                        checked={selectedAssets.includes(asset.id)}
                        onChange={() => toggleAsset(asset.id)}
                      />
                      <span className="text-2xl">{asset.type === "video" ? "🎬" : asset.type === "image" ? "🖼️" : "📄"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.client} • {asset.size} MB</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {asset.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Preview</DropdownMenuItem>
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem>Edit Tags</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
