
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
          "relative inline-flex h-[30px] w-[60px] shrink-0 cursor-pointer rounded-full transition-colors duration-200",
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
            "pointer-events-none flex items-center justify-center rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.1)]",
            "h-[26px] w-[26px] transform transition-transform duration-200",
            checked ? "translate-x-[17px]" : "translate-x-[17px]"
          )}
        />
      </button>
    );
  }
);

CustomSwitch.displayName = "CustomSwitch";

export { CustomSwitch };
