"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Info, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import type { LogEntry } from "@/lib/account-creator";

interface LogViewerProps {
  logs: LogEntry[];
}

export function LogViewer({ logs }: LogViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogIcon = (level: LogEntry["level"]) => {
    switch (level) {
      case "INFO":
        return <Info className="h-3.5 w-3.5 text-blue-400" />;
      case "WARNING":
        return <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />;
      case "ERROR":
        return <XCircle className="h-3.5 w-3.5 text-destructive" />;
      case "SUCCESS":
        return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
    }
  };

  const getLogColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "INFO":
        return "text-foreground";
      case "WARNING":
        return "text-amber-400";
      case "ERROR":
        return "text-destructive";
      case "SUCCESS":
        return "text-green-500";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <CardTitle>Activity Log</CardTitle>
        </div>
        <CardDescription>
          Real-time process activity and status updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]" ref={scrollRef}>
          <div className="space-y-1 font-mono text-xs pr-4">
            {logs.length === 0 ? (
              <div className="flex h-[160px] items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Terminal className="mx-auto h-12 w-12 opacity-20" />
                  <p className="mt-2 text-sm font-sans">No activity yet</p>
                  <p className="font-sans">Logs will appear here when you start creation</p>
                </div>
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 rounded px-2 py-1.5 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-muted-foreground shrink-0">
                    [{log.timestamp}]
                  </span>
                  <span className="shrink-0">{getLogIcon(log.level)}</span>
                  <span className={getLogColor(log.level)}>{log.message}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
