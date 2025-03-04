
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
          "relative inline-flex h-8 px-3 shrink-0 cursor-pointer rounded-md border font-medium text-sm items-center justify-center transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          checked 
            ? "bg-[#007AFF] text-white border-[#007AFF]" 
            : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {checked ? "An" : "Aus"}
      </button>
    );
  }
);

CustomSwitch.displayName = "CustomSwitch";

export { CustomSwitch };
