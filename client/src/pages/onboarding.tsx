import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";

const steps = [
  { id: 1, title: "Client Details", description: "Basic information" },
  { id: 2, title: "Brand Voice", description: "Tone and values" },
  { id: 3, title: "Platforms", description: "Social accounts" },
  { id: 4, title: "Billing", description: "Subscription tier" },
  { id: 5, title: "Complete", description: "Ready to go" }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: "",
    website: "",
    timezone: "UTC",
    brandVoice: "professional",
    description: "",
    audience: "",
    platforms: [] as string[],
    tier: "starter"
  });

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-3xl mx-auto w-full animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Onboard New Client</h1>
        <p className="text-muted-foreground mt-1">Get started by completing these steps</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Indicator */}
      <div className="grid grid-cols-5 gap-2">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`p-3 rounded-lg border transition-all text-center ${
              currentStep === step.id
                ? "bg-primary/10 border-primary shadow-sm"
                : currentStep > step.id
                ? "bg-emerald-500/10 border-emerald-200"
                : "bg-muted/30 border-border/50 opacity-50"
            }`}
          >
            {currentStep > step.id ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
            ) : (
              <span className="text-sm font-semibold">{step.id}</span>
            )}
            <p className="text-xs font-medium mt-1 line-clamp-1">{step.title}</p>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Client Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Client Name *</Label>
                <Input
                  placeholder="e.g., Acme Corp"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Timezone *</Label>
                <Select value={formData.timezone} onValueChange={(val) => setFormData({ ...formData, timezone: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New York</SelectItem>
                    <SelectItem value="America/Chicago">America/Chicago</SelectItem>
                    <SelectItem value="America/Denver">America/Denver</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los Angeles</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                    <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Brand Voice */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Brand Voice *</Label>
                <RadioGroup value={formData.brandVoice} onValueChange={(val) => setFormData({ ...formData, brandVoice: val })}>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:bg-muted/30">
                    <RadioGroupItem value="professional" id="professional" />
                    <Label htmlFor="professional" className="flex-1 cursor-pointer font-normal">Professional & Formal</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:bg-muted/30">
                    <RadioGroupItem value="playful" id="playful" />
                    <Label htmlFor="playful" className="flex-1 cursor-pointer font-normal">Playful & Casual</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:bg-muted/30">
                    <RadioGroupItem value="inspirational" id="inspirational" />
                    <Label htmlFor="inspirational" className="flex-1 cursor-pointer font-normal">Inspirational & Motivational</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:bg-muted/30">
                    <RadioGroupItem value="luxury" id="luxury" />
                    <Label htmlFor="luxury" className="flex-1 cursor-pointer font-normal">Luxury & Premium</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Brand Description</Label>
                <Textarea
                  placeholder="Tell us about your client's brand, values, and unique selling points..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Input
                  placeholder="e.g., Young professionals, families, tech enthusiasts..."
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Platforms */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Select which platforms this client will use</p>
              <div className="grid grid-cols-2 gap-3">
                {["Instagram", "Facebook", "LinkedIn", "Twitter", "TikTok", "YouTube"].map(platform => (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.platforms.includes(platform)
                        ? "bg-primary/10 border-primary shadow-sm"
                        : "bg-muted/30 border-border/50 hover:border-border"
                    }`}
                  >
                    <p className="font-semibold">{platform}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground pt-4">Selected: {formData.platforms.join(", ") || "None"}</p>
            </div>
          )}

          {/* Step 4: Billing */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Choose a subscription tier for this client</p>
              <RadioGroup value={formData.tier} onValueChange={(val) => setFormData({ ...formData, tier: val })}>
                <div className="p-4 rounded-lg border-2 border-border/50 hover:border-primary cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="free" id="free" />
                    <Label htmlFor="free" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Free</div>
                      <div className="text-sm text-muted-foreground">1 platform, 5 posts/month, community support</div>
                    </Label>
                  </div>
                </div>

                <div className="p-4 rounded-lg border-2 border-primary/30 bg-primary/5 cursor-pointer">
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="starter" id="starter" />
                    <Label htmlFor="starter" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Starter - $29/mo</div>
                      <div className="text-sm text-muted-foreground">3 platforms, 50 posts/month, email support</div>
                    </Label>
                  </div>
                </div>

                <div className="p-4 rounded-lg border-2 border-border/50 hover:border-primary cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pro" id="pro" />
                    <Label htmlFor="pro" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Pro - $79/mo</div>
                      <div className="text-sm text-muted-foreground">All platforms, unlimited posts, priority support</div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Welcome to AgencySocial AI!</h2>
              <p className="text-muted-foreground mb-4">
                {formData.clientName} has been successfully onboarded. Send them an invite link to get started!
              </p>
              <div className="bg-muted/30 p-4 rounded-lg mb-4">
                <p className="text-sm text-muted-foreground mb-2">Invite Link:</p>
                <Input value="https://app.agencysocial.ai/invite/abc123def456" readOnly />
              </div>
            </div>
          )}
        </CardContent>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-border/50">
          <Button
            variant="outline"
            disabled={currentStep === 1}
            onClick={handlePrev}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          {currentStep < 5 ? (
            <Button onClick={handleNext} className="bg-primary hover:opacity-90">
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Send Invite & Close
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
