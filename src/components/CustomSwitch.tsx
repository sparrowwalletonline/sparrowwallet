
import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-md transition-colors",
          "border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          checked 
            ? "bg-blue-600 border-blue-600" 
            : "bg-gray-200 border-gray-200 dark:bg-gray-700 dark:border-gray-700",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none flex items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-transform",
            "h-5 w-5 transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        >
          {checked && <Check className="h-3 w-3 text-blue-600" />}
        </span>
      </button>
    );
  }
);

CustomSwitch.displayName = "CustomSwitch";

export { CustomSwitch };
