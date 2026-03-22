"use client";

import { useState, useCallback } from "react";
import { Bot, Settings, Play, Download, RefreshCw, Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfigPanel } from "@/components/config-panel";
import { AccountsTable } from "@/components/accounts-table";
import { LogViewer } from "@/components/log-viewer";
import { StatsCard } from "@/components/stats-card";
import { useToast } from "@/hooks/use-toast";
import type { CreatedAccount, LogEntry } from "@/lib/account-creator";
import { generateRandomEmail, formatTimestamp } from "@/lib/account-creator";

export function Dashboard() {
  const [config, setConfig] = useState({
    password: "SecurePassword123!",
    accountCount: 1,
    headless: true,
  });
  const [accounts, setAccounts] = useState<CreatedAccount[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();

  const addLog = useCallback((message: string, level: LogEntry["level"] = "INFO") => {
    setLogs((prev) => [
      ...prev,
      { timestamp: formatTimestamp(), message, level },
    ]);
  }, []);

  const simulateAccountCreation = useCallback(async () => {
    if (config.password.length < 12) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 12 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setProgress({ current: 0, total: config.accountCount });
    addLog(`Starting account creation process for ${config.accountCount} account(s)`, "INFO");

    for (let i = 0; i < config.accountCount; i++) {
      setProgress({ current: i + 1, total: config.accountCount });
      addLog(`Processing account ${i + 1}/${config.accountCount}...`, "INFO");

      try {
        // Generate email using the actual generator
        addLog("Generating temporary email...", "INFO");
        const { email, firstName, lastName } = await generateRandomEmail();
        const name = `${firstName} ${lastName}`;
        
        addLog(`Generated email: ${email}`, "SUCCESS");
        addLog(`Generated name: ${name}`, "INFO");

        // Simulate account creation steps
        addLog("Navigating to ChatGPT signup page...", "INFO");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        addLog("Clicking Sign Up button...", "INFO");
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        addLog("Filling email address...", "INFO");
        await new Promise((resolve) => setTimeout(resolve, 600));
        
        addLog("Clicking Continue...", "INFO");
        await new Promise((resolve) => setTimeout(resolve, 700));
        
        addLog("Setting up password...", "INFO");
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Simulate success/failure randomly for demo
        const isSuccess = Math.random() > 0.3;

        if (isSuccess) {
          addLog(`Account created successfully: ${email}`, "SUCCESS");
          setAccounts((prev) => [
            ...prev,
            {
              email,
              password: config.password,
              name,
              createdAt: formatTimestamp(),
              status: "success",
            },
          ]);
        } else {
          addLog(`Failed to create account: ${email}`, "ERROR");
          setAccounts((prev) => [
            ...prev,
            {
              email,
              password: config.password,
              name,
              createdAt: formatTimestamp(),
              status: "failed",
            },
          ]);
        }
      } catch (error) {
        addLog(`Error generating email: ${error instanceof Error ? error.message : "Unknown error"}`, "ERROR");
      }

      // Small delay between accounts
      if (i < config.accountCount - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    addLog("Account creation process completed", "SUCCESS");
    setIsRunning(false);
    setProgress({ current: 0, total: 0 });

    toast({
      title: "Process Complete",
      description: `Finished processing ${config.accountCount} account(s).`,
    });
  }, [config, addLog, toast]);

  const exportAccounts = useCallback(() => {
    const successfulAccounts = accounts.filter((a) => a.status === "success");
    if (successfulAccounts.length === 0) {
      toast({
        title: "No Accounts",
        description: "No successful accounts to export.",
        variant: "destructive",
      });
      return;
    }

    const content = successfulAccounts
      .map((a) => `${a.email}|${a.password}`)
      .join("\n");
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "accounts.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${successfulAccounts.length} account(s).`,
    });
  }, [accounts, toast]);

  const clearAll = useCallback(() => {
    setAccounts([]);
    setLogs([]);
    toast({
      title: "Cleared",
      description: "All accounts and logs have been cleared.",
    });
  }, [toast]);

  const stats = {
    total: accounts.length,
    success: accounts.filter((a) => a.status === "success").length,
    failed: accounts.filter((a) => a.status === "failed").length,
    pending: accounts.filter((a) => a.status === "pending").length,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance">ChatGPT Account Creator</h1>
            <p className="text-sm text-muted-foreground">
              Automated account creation with temporary emails
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            disabled={isRunning}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Clear All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportAccounts}
            disabled={accounts.filter((a) => a.status === "success").length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Accounts"
          value={stats.total}
          icon={Users}
          description="All created accounts"
        />
        <StatsCard
          title="Successful"
          value={stats.success}
          icon={CheckCircle2}
          description="Successfully created"
          variant="success"
        />
        <StatsCard
          title="Failed"
          value={stats.failed}
          icon={XCircle}
          description="Creation failed"
          variant="destructive"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          description="In progress"
          variant="warning"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Config Panel */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <CardTitle>Configuration</CardTitle>
            </div>
            <CardDescription>
              Configure account creation settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConfigPanel
              config={config}
              onConfigChange={setConfig}
              isRunning={isRunning}
            />
            <div className="mt-6">
              <Button
                onClick={simulateAccountCreation}
                disabled={isRunning}
                className="w-full"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Creating ({progress.current}/{progress.total})
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Creation
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Accounts & Logs */}
        <div className="space-y-6 lg:col-span-2">
          <AccountsTable accounts={accounts} />
          <LogViewer logs={logs} />
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="py-4">
          <p className="text-sm text-amber-200">
            <strong>Disclaimer:</strong> This tool is for educational purposes only. Creating accounts in bulk may violate terms of service and could result in IP blocking. Use responsibly and at your own risk.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
