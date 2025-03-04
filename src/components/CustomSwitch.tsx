
import * as React from "react";
import { cn } from "@/lib/utils";

interface CustomSwitchProps extends React.HTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const CustomSwitch = React.forwardRef<HTMLButtonElement, CustomSwitchProps>(
  ({ checked, onCheckedChange, disabled = false, className, ...props }, ref) => {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        disabled={disabled}
        ref={ref}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-[20px] w-[40px] shrink-0 cursor-pointer rounded-full transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          checked 
            ? "bg-[#007AFF]" 
            : "bg-gray-200 dark:bg-gray-600",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.2)]",
            "h-[16px] w-[16px] transform transition-transform duration-200",
            checked ? "translate-x-[22px]" : "translate-x-[2px]"
          )}
        />
      </button>
    );
  }
);

CustomSwitch.displayName = "CustomSwitch";

export { CustomSwitch };
