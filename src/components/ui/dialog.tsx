
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Ensure only one dialog is open at a time
let activeDialog: string | null = null;

// Add TypeScript interface for the global window object
declare global {
  interface Window {
    disableAllModals?: boolean;
  }
}

const Dialog = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>
>(({ open, onOpenChange, ...props }, ref) => {
  const dialogId = React.useId();
  
  // Store initial open state to determine if we're trying to open a dialog
  const isOpeningDialog = React.useRef(false);
  
  React.useEffect(() => {
    if (open && !isOpeningDialog.current) {
      isOpeningDialog.current = true;
    } else if (!open) {
      isOpeningDialog.current = false;
    }
  }, [open]);

  React.useEffect(() => {
    // Block modals when flag is set
    if (typeof window !== 'undefined' && window.disableAllModals) {
      // If we're trying to open a dialog but modals are disabled, prevent it
      if (open) {
        console.log("Dialog prevented from opening due to global modal disable flag");
        if (onOpenChange) {
          onOpenChange(false);
        }
      }
      return;
    }
    
    // Normal dialog management
    if (open && dialogId !== activeDialog) {
      activeDialog = dialogId;
    } else if (!open && dialogId === activeDialog) {
      activeDialog = null;
    }
  }, [open, dialogId, onOpenChange]);

  // Check modal blocking flag before rendering
  const shouldBlockModal = typeof window !== 'undefined' && window.disableAllModals;
  const effectiveOpen = shouldBlockModal ? false : open;

  return (
    <DialogPrimitive.Root 
      open={effectiveOpen} 
      onOpenChange={onOpenChange} 
      {...props} 
    />
  );
});
Dialog.displayName = "Dialog";

const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(({
  className,
  ...props
}, ref) => <DialogPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)} {...props} />);

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  hideCloseButton?: boolean;
  fullScreen?: boolean;
}

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(({
  className,
  children,
  hideCloseButton = false,
  fullScreen = false,
  ...props
}, ref) => {
  // Check if modals are disabled globally
  const isDisabled = typeof window !== 'undefined' && window.disableAllModals;
  
  // If modals are disabled, don't render anything
  if (isDisabled) {
    return null;
  }
  
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content ref={ref} className={cn("fixed z-[10001] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", fullScreen ? "inset-0 w-full h-full border-none rounded-none" : "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg gap-4 border bg-background p-6 shadow-lg data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className)} aria-describedby={props['aria-describedby'] || "dialog-description"} {...props}>
        {children}
        {!hideCloseButton && <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>}
        <span id="dialog-description" className="sr-only">Dialog Content</span>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />;

DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />;

DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(({
  className,
  ...props
}, ref) => <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />);

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Description>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(({
  className,
  ...props
}, ref) => <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />);

DialogDescription.displayName = DialogPrimitive.Description.displayName;

export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
