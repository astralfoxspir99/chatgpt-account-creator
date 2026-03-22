import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  variant?: "default" | "success" | "destructive" | "warning";
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
}: StatsCardProps) {
  const variants = {
    default: {
      icon: "bg-primary/10 text-primary",
      value: "text-foreground",
    },
    success: {
      icon: "bg-green-500/10 text-green-500",
      value: "text-green-500",
    },
    destructive: {
      icon: "bg-destructive/10 text-destructive",
      value: "text-destructive",
    },
    warning: {
      icon: "bg-amber-500/10 text-amber-500",
      value: "text-amber-500",
    },
  };

  const styles = variants[variant];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-3xl font-bold tracking-tight mt-1", styles.value)}>
              {value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", styles.icon)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
