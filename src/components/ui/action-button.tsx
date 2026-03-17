"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { AnimatedBorder } from "@/components/ui/animated-border";
import { cn } from "@/lib/utils";

interface ActionButtonProps extends ButtonProps {
  showAnimation?: boolean;
  animationDuration?: number;
  borderRadius?: number;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ children, className, showAnimation = false, animationDuration, borderRadius = 50, ...props }, ref) => {
    const buttonElement = (
      <Button
        ref={ref}
        className={cn(className)}
        {...props}
      >
        {children}
      </Button>
    );

    if (showAnimation) {
      return (
        <AnimatedBorder 
          borderRadius={borderRadius} 
          duration={animationDuration}
          className="w-full"
        >
          {buttonElement}
        </AnimatedBorder>
      );
    }

    return buttonElement;
  }
);

ActionButton.displayName = "ActionButton";

export { ActionButton };
