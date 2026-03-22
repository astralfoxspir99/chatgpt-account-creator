"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState } from "react";

interface Config {
  password: string;
  accountCount: number;
  headless: boolean;
}

interface ConfigPanelProps {
  config: Config;
  onConfigChange: (config: Config) => void;
  isRunning: boolean;
}

export function ConfigPanel({ config, onConfigChange, isRunning }: ConfigPanelProps) {
  const [showPassword, setShowPassword] = useState(false);

  const passwordValid = config.password.length >= 12;

  return (
    <div className="space-y-5">
      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Account Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={config.password}
            onChange={(e) =>
              onConfigChange({ ...config, password: e.target.value })
            }
            disabled={isRunning}
            className="pr-10"
            placeholder="Min. 12 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {!passwordValid && config.password.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3 w-3" />
            <span>Password must be at least 12 characters</span>
          </div>
        )}
        {passwordValid && (
          <p className="text-xs text-primary">Password meets requirements</p>
        )}
      </div>

      {/* Account Count */}
      <div className="space-y-2">
        <Label htmlFor="accountCount">Number of Accounts</Label>
        <Input
          id="accountCount"
          type="number"
          min={1}
          max={10}
          value={config.accountCount}
          onChange={(e) =>
            onConfigChange({
              ...config,
              accountCount: Math.min(10, Math.max(1, parseInt(e.target.value) || 1)),
            })
          }
          disabled={isRunning}
        />
        <p className="text-xs text-muted-foreground">
          Maximum 10 accounts per session
        </p>
      </div>

      {/* Headless Mode */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
        <div className="space-y-0.5">
          <Label htmlFor="headless" className="cursor-pointer">
            Headless Mode
          </Label>
          <p className="text-xs text-muted-foreground">
            Run browser in background
          </p>
        </div>
        <Switch
          id="headless"
          checked={config.headless}
          onCheckedChange={(checked) =>
            onConfigChange({ ...config, headless: checked })
          }
          disabled={isRunning}
        />
      </div>
    </div>
  );
}
