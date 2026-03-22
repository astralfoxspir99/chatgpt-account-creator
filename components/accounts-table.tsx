"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, Clock, Mail, Copy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { CreatedAccount } from "@/lib/account-creator";

interface AccountsTableProps {
  accounts: CreatedAccount[];
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const getStatusIcon = (status: CreatedAccount["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500 animate-pulse" />;
    }
  };

  const getStatusBadge = (status: CreatedAccount["status"]) => {
    const styles = {
      success: "bg-green-500/10 text-green-500 border-green-500/20",
      failed: "bg-destructive/10 text-destructive border-destructive/20",
      pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
      >
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle>Created Accounts</CardTitle>
        </div>
        <CardDescription>
          {accounts.length === 0
            ? "No accounts created yet"
            : `${accounts.length} account(s) created`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px]">
          {accounts.length === 0 ? (
            <div className="flex h-[240px] items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Mail className="mx-auto h-12 w-12 opacity-20" />
                <p className="mt-2 text-sm">No accounts yet</p>
                <p className="text-xs">Start the creation process to see accounts here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pr-4">
              {accounts.map((account, index) => (
                <div
                  key={index}
                  className="group rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="truncate font-mono text-sm">
                          {account.email}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            copyToClipboard(`${account.email}|${account.password}`)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{account.name}</span>
                        <span>{account.createdAt}</span>
                      </div>
                    </div>
                    {getStatusBadge(account.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
