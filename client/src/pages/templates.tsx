import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Copy, Trash2, Eye, Code, Type, Image as ImageIcon, Square } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockTemplates = [
  {
    id: 1,
    name: "Product Launch",
    description: "Announcements for new product releases",
    blocks: [
      { id: "h1", type: "heading", content: "Introducing {product_name}" },
      { id: "img", type: "image", placeholder: "Upload hero image" },
      { id: "body", type: "body", content: "{description}\n\n{key_benefits}" },
      { id: "cta", type: "cta", text: "Shop Now", link: "{product_link}" }
    ],
    usageCount: 12,
    isSystem: true
  },
  {
    id: 2,
    name: "Behind the Scenes",
    description: "Team and company culture stories",
    blocks: [
      { id: "h1", type: "heading", content: "Behind the Scenes 👀" },
      { id: "carousel", type: "carousel", placeholder: "Select 3-5 images" },
      { id: "body", type: "body", content: "{story}\n\n#BehindTheScenes #TeamWork" }
    ],
    usageCount: 8,
    isSystem: true
  },
  {
    id: 3,
    name: "Promotional Offer",
    description: "Limited-time discounts and flash sales",
    blocks: [
      { id: "badge", type: "badge", content: "LIMITED TIME" },
      { id: "h1", type: "heading", content: "{offer_title}" },
      { id: "body", type: "body", content: "{offer_description}\n\nUse code: {coupon_code}" },
      { id: "cta", type: "cta", text: "Claim Offer", link: "{offer_link}" }
    ],
    usageCount: 24,
    isSystem: false
  }
];

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState(mockTemplates[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(selectedTemplate.name);

  const blockIcons = {
    heading: Type,
    body: Code,
    image: ImageIcon,
    carousel: ImageIcon,
    cta: Square,
    badge: Square
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Library</h1>
          <p className="text-muted-foreground mt-1">Create branded email and social templates for your clients.</p>
        </div>
        <Button className="bg-primary hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" /> New Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-12rem)]">
        {/* Templates List */}
        <div className="col-span-1 flex flex-col gap-2 border rounded-lg bg-muted/30 p-3 overflow-y-auto">
          <h3 className="font-semibold text-sm px-2 sticky top-0 bg-background/80 backdrop-blur py-2">All Templates</h3>
          {mockTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template);
                setEditName(template.name);
              }}
              className={`text-left p-3 rounded-lg border transition-all ${
                selectedTemplate.id === template.id
                  ? "bg-primary/10 border-primary shadow-sm"
                  : "bg-background hover:bg-muted border-border/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{template.description}</p>
                </div>
                {template.isSystem && (
                  <Badge variant="secondary" className="shrink-0 text-xs">System</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Used {template.usageCount} times</p>
            </button>
          ))}
        </div>

        {/* Editor & Preview */}
        <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
          <Tabs defaultValue="editor" className="w-full flex-1 flex flex-col">
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>

            {/* Editor Tab */}
            <TabsContent value="editor" className="flex-1 overflow-y-auto mt-0">
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {isEditing ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="font-bold text-lg"
                          autoFocus
                        />
                      ) : (
                        <h2 className="font-bold text-lg">{selectedTemplate.name}</h2>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">{selectedTemplate.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => setIsEditing(!isEditing)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Template Blocks</h3>
                    <div className="space-y-2">
                      {selectedTemplate.blocks.map((block) => {
                        const Icon = blockIcons[block.type as keyof typeof blockIcons] || Code;
                        return (
                          <div key={block.id} className="p-3 rounded-lg border border-border/50 bg-muted/20 flex items-start gap-3 group hover:bg-muted/40 transition-all">
                            <Icon className="h-4 w-4 text-primary mt-1 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium capitalize">{block.type}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{block.content || block.placeholder}</p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <Button size="icon" variant="ghost" className="h-7 w-7">
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Add Block
                    </Button>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-primary">Save Template</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="flex-1 overflow-y-auto mt-0">
              <Card className="glass-card">
                <CardContent className="pt-6 space-y-4">
                  <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 p-8 rounded-lg border-2 border-dashed border-primary/20">
                    <h1 className="text-3xl font-bold text-primary mb-4">Introducing New Product</h1>
                    <div className="h-40 bg-muted/30 rounded-lg mb-4 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <p className="text-lg leading-relaxed mb-6">
                      This is where the description and key benefits would appear. You can customize the content using variables like {"{description}"} and {"{key_benefits}"}.
                    </p>
                    <Button className="w-full">Shop Now</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* HTML Tab */}
            <TabsContent value="html" className="flex-1 overflow-y-auto mt-0">
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <Textarea
                    value={`<div class="email-template">
  <h1>{product_name}</h1>
  <img src="{product_image}" alt="Product" />
  <p>{description}</p>
  <a href="{product_link}" class="cta">Shop Now</a>
</div>`}
                    readOnly
                    className="font-mono text-xs min-h-[300px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
