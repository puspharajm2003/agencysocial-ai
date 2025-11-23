import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, Circle, Copy, ExternalLink } from "lucide-react";
import { api, getAPIConfig, APIError } from "@/lib/api";
import { toast } from "sonner";

export default function APIDebug() {
  const config = getAPIConfig();
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [testResult, setTestResult] = useState<any>(null);

  const testAPI = async () => {
    setStatus("testing");
    setErrorMsg("");
    try {
      const response = await api.drafts.getDraft("test_123");
      setStatus("success");
      setTestResult(response);
    } catch (error) {
      setStatus("error");
      if (error instanceof APIError) {
        setErrorMsg(`${error.statusCode}: ${error.message}`);
      } else {
        setErrorMsg(String(error));
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const statusBadge = {
    idle: <Circle className="h-4 w-4 text-muted-foreground" />,
    testing: <Circle className="h-4 w-4 text-blue-500 animate-spin" />,
    success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    error: <AlertCircle className="h-4 w-4 text-destructive" />
  };

  const envVars = {
    "VITE_API_URL": import.meta.env.VITE_API_URL,
    "VITE_WS_URL": import.meta.env.VITE_WS_URL,
    "VITE_API_TIMEOUT": import.meta.env.VITE_API_TIMEOUT,
    "VITE_USE_MOCKS": import.meta.env.VITE_USE_MOCKS,
    "MODE": import.meta.env.MODE
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Debug Console</h1>
          <p className="text-muted-foreground mt-1">Check your backend integration setup</p>
        </div>

        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="test">Test API</TabsTrigger>
            <TabsTrigger value="docs">Integration Docs</TabsTrigger>
          </TabsList>

          {/* Status Tab */}
          <TabsContent value="status" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-semibold">Using Mocks</span>
                    <Badge className={config.useMocks ? "bg-blue-500" : "bg-emerald-500"}>
                      {config.useMocks ? "✓ Yes (Development)" : "✓ No (Production)"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-semibold">API URL</span>
                    <code className="text-xs bg-slate-800 text-slate-100 px-2 py-1 rounded">
                      {config.apiUrl}
                    </code>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-semibold">Timeout (ms)</span>
                    <code className="text-xs bg-slate-800 text-slate-100 px-2 py-1 rounded">
                      {config.timeout}
                    </code>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-semibold">Auth Token</span>
                    <Badge variant={config.hasAuthToken ? "default" : "outline"}>
                      {config.hasAuthToken ? "✓ Present" : "✗ Missing"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-semibold">Environment</span>
                    <code className="text-xs bg-slate-800 text-slate-100 px-2 py-1 rounded">
                      {config.environment}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(envVars).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                    <span className="font-mono">{key}</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs">{String(value)}</code>
                      <button
                        onClick={() => copyToClipboard(String(value))}
                        className="p-1 hover:bg-slate-300 dark:hover:bg-slate-700 rounded"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card border-blue-200/30 bg-blue-50/50 dark:bg-blue-950/20">
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold">Configuration Guide</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <strong>Using Mocks?</strong> Change to <code className="bg-muted px-1 rounded">VITE_USE_MOCKS=false</code> in <code className="bg-muted px-1 rounded">.env</code>
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Backend not running?</strong> Start your backend server on <code className="bg-muted px-1 rounded">{config.apiUrl}</code>
                  </p>
                  <p className="text-muted-foreground">
                    <strong>No auth token?</strong> Login first, token will be saved to localStorage
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test API Tab */}
          <TabsContent value="test" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Test API Connection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={testAPI} disabled={status === "testing"} className="w-full">
                  {status === "testing" ? "Testing..." : "Test API Endpoint"}
                </Button>

                {status !== "idle" && (
                  <div className={`p-4 rounded-lg flex items-start gap-3 ${
                    status === "success" ? "bg-emerald-50 dark:bg-emerald-950/30" :
                    status === "error" ? "bg-destructive/10" : "bg-blue-50 dark:bg-blue-950/30"
                  }`}>
                    {statusBadge[status]}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">
                        {status === "testing" && "Testing connection..."}
                        {status === "success" && "✓ API Connection Successful"}
                        {status === "error" && "✗ API Connection Failed"}
                      </p>
                      {status === "error" && (
                        <p className="text-xs text-destructive mt-1">{errorMsg}</p>
                      )}
                      {status === "success" && testResult && (
                        <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto max-h-60">
                          {JSON.stringify(testResult, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-muted p-3 rounded text-xs space-y-2">
                  <p className="font-semibold">What's being tested?</p>
                  <p className="text-muted-foreground">
                    {config.useMocks 
                      ? "Testing MOCK API - No backend required, responses are instant"
                      : `Testing REAL BACKEND - Connecting to ${config.apiUrl}/drafts/test_123`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-amber-200/30 bg-amber-50/50 dark:bg-amber-950/20">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Testing Mocks?</strong> Response will be instant (500ms simulated delay).
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Testing Real Backend?</strong> Make sure your backend is running on <code className="bg-muted px-1 rounded">{config.apiUrl}</code>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Docs Tab */}
          <TabsContent value="docs" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Integration Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-2">
                  <h3 className="font-semibold">Step 1: Development (Using Mocks)</h3>
                  <code className="block bg-muted p-2 rounded text-xs whitespace-pre">
{`npm run dev
# Uses VITE_USE_MOCKS=true automatically
# No backend needed, fast iteration`}
                  </code>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Step 2: Switch to Real Backend</h3>
                  <code className="block bg-muted p-2 rounded text-xs whitespace-pre">
{`# 1. Start your backend
cd ../server && npm run dev

# 2. Update .env.development
VITE_USE_MOCKS=false
VITE_API_URL=http://localhost:3000/api

# 3. Start frontend
npm run dev`}
                  </code>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Step 3: Deploy to Production</h3>
                  <code className="block bg-muted p-2 rounded text-xs whitespace-pre">
{`# .env.production
VITE_USE_MOCKS=false
VITE_API_URL=https://your-api.com/api
VITE_WS_URL=wss://your-api.com

npm run build && npm run preview`}
                  </code>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">API Endpoints Used</h3>
                  <div className="space-y-1 text-xs">
                    <p><code className="bg-muted px-1">POST /api/drafts</code> - Create draft</p>
                    <p><code className="bg-muted px-1">GET /api/drafts/:id</code> - Get draft</p>
                    <p><code className="bg-muted px-1">POST /api/approvals/:id/approve</code> - Approve post</p>
                    <p><code className="bg-muted px-1">GET /api/notifications</code> - Get notifications</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/30 bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold">Need More Info?</h3>
                <div className="space-y-2 text-sm">
                  <a href="/BACKEND_SETUP.md" target="_blank" className="flex items-center gap-2 text-primary hover:underline">
                    Backend Setup Guide <ExternalLink className="h-3 w-3" />
                  </a>
                  <a href="/API_INTEGRATION_GUIDE.md" target="_blank" className="flex items-center gap-2 text-primary hover:underline">
                    API Integration Guide <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
