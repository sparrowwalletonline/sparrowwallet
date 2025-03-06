
import { toast } from '@/hooks/use-toast';

export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text).then(
    () => {
      console.log("Text copied to clipboard successfully:", text);
      toast({
        title: "Copied to clipboard",
        description: "The text has been copied to your clipboard.",
        duration: 3000,
      });
    },
    (err) => {
      console.error('Could not copy text: ', err);
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard.",
        variant: "destructive",
        duration: 3000,
      });
    }
  );
};
