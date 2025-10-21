import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      showPercentage = false,
      size = "md",
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
      sm: "h-2",
      md: "h-3",
      lg: "h-4",
    };

    return (
      <div className="w-full">
        <div
          ref={ref}
          className={cn(
            "relative overflow-hidden rounded-full bg-secondary",
            sizeClasses[size],
            className
          )}
          {...props}
        >
          <div
            className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </div>
        {showPercentage && (
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>Progreso</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };

