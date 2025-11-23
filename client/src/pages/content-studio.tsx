import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Image as ImageIcon, Copy, RefreshCw, Check, Instagram, Linkedin, Twitter, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function ContentStudio() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Array<{ id: number; url: string; prompt: string }>>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent("Here is a sample AI generated caption that is perfectly optimized for your brand voice. #AgencySocial #AI #Marketing \n\n✨ Transform your social presence today!");
      setIsGenerating(false);
    }, 1500);
  };

  const handleGenerateImages = () => {
    setIsGeneratingImages(true);
    // Simulate image generation with realistic timing
    setTimeout(() => {
      setGeneratedImages([
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop",
          prompt: "Professional tech product showcase with modern aesthetics"
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop",
          prompt: "Sleek digital interface with glowing elements"
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1552821206-24d69c4ae4a5?w=400&h=400&fit=crop",
          prompt: "Creative workspace with innovation theme"
        }
      ]);
      setIsGeneratingImages(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-8rem)] p-4 max-w-[1600px] mx-auto">
      {/* Left Panel: Controls */}
      <div className="w-full md:w-1/3 lg:w-[400px] flex flex-col gap-4 h-full overflow-y-auto pr-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Studio</h1>
          <p className="text-muted-foreground">Generate high-converting posts with AI.</p>
        </div>

        <Card className="glass-card">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Client / Brand</Label>
              <Select defaultValue="acme">
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acme">Acme Corp</SelectItem>
                  <SelectItem value="tech">TechStart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Topic or Idea</Label>
              <Textarea placeholder="e.g. Launching our new summer collection with 20% off..." className="min-h-[100px]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select defaultValue="professional">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="playful">Playful</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select defaultValue="instagram">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">X / Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label>Creativity Level</Label>
                <span className="text-xs text-muted-foreground">Balanced</span>
              </div>
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch id="emojis" defaultChecked />
              <Label htmlFor="emojis">Include Emojis</Label>
            </div>

            <Button className="w-full mt-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate Drafts
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel: Preview & Results */}
      <div className="flex-1 h-full flex flex-col gap-4 overflow-hidden">
        <Tabs defaultValue="caption" className="w-full flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
             <TabsList>
              <TabsTrigger value="caption">Caption Generator</TabsTrigger>
              <TabsTrigger value="image">Image Prompts</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
               <Badge variant="outline" className="bg-background/50 backdrop-blur">
                 <Zap className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" /> 120 Credits Used
               </Badge>
            </div>
          </div>
         
          <TabsContent value="caption" className="flex-1 overflow-y-auto mt-0">
            {generatedContent ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="glass-card border-primary/20 overflow-hidden flex flex-col">
                    <CardHeader className="bg-muted/30 pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-white/50">Option {i}</Badge>
                        <div className="flex gap-1">
                           <Button size="icon" variant="ghost" className="h-8 w-8"><Copy className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 flex-1">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {generatedContent}
                      </p>
                    </CardContent>
                    <div className="p-4 pt-0 mt-auto">
                       <Button className="w-full" variant="secondary">Use This Version</Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl bg-muted/10">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Ready to Create?</h3>
                <p className="text-muted-foreground max-w-md mt-2">
                  Fill out the form on the left to generate AI-powered captions, hashtags, and ideas for your clients.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="image" className="flex-1 mt-0 overflow-y-auto">
            {generatedImages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl bg-muted/10">
                <div className="h-20 w-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <ImageIcon className="h-10 w-10 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold">AI Image Generation</h3>
                <p className="text-muted-foreground max-w-md mt-2">
                  Generate photorealistic or stylized images for your posts using AI.
                </p>
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700" onClick={handleGenerateImages} disabled={isGeneratingImages}>
                  {isGeneratingImages ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating Images...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> Generate Images
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {generatedImages.map((img) => (
                  <Card key={img.id} className="glass-card border-purple-500/20 overflow-hidden flex flex-col group">
                    <div className="relative aspect-square bg-gradient-to-br from-purple-500/10 to-pink-500/10 overflow-hidden">
                      <img src={img.url} alt={img.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardHeader className="pb-2">
                      <Badge variant="secondary" className="w-fit">AI Generated</Badge>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-2">{img.prompt}</p>
                    </CardContent>
                    <div className="p-4 pt-0 border-t border-border/50 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Copy className="h-4 w-4 mr-1" /> Download
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary">
                        Use Image
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
