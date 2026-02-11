import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface SeedPhraseRecoveryProps {
  onBack: () => void;
  onSuccess: () => void;
}

const SeedPhraseRecovery: React.FC<SeedPhraseRecoveryProps> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [seedWords, setSeedWords] = useState<string[]>(Array(12).fill(''));
  const [loading, setLoading] = useState(false);

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...seedWords];
    newWords[index] = value.trim().toLowerCase();
    setSeedWords(newWords);
  };

  const handlePaste = (e: React.ClipboardEvent, index: number) => {
    const pastedText = e.clipboardData.getData('text').trim();
    const words = pastedText.split(/\s+/);
    if (words.length > 1) {
      e.preventDefault();
      const newWords = [...seedWords];
      words.forEach((word, i) => {
        if (index + i < 12) {
          newWords[index + i] = word.toLowerCase();
        }
      });
      setSeedWords(newWords);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filledWords = seedWords.filter(w => w.length > 0);
    if (filledWords.length < 12) {
      toast({
        title: "Fehler",
        description: "Bitte gib alle 12 Wörter deiner Seed Phrase ein",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Fehler",
        description: "Bitte gib deine E-Mail-Adresse ein",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-seed-phrase', {
        body: { email, seedPhrase: seedWords },
      });

      if (error || data?.error) {
        toast({
          title: "Fehler",
          description: data?.error || error?.message || "Verifizierung fehlgeschlagen",
          variant: "destructive",
        });
        return;
      }

      if (data?.token_hash) {
        // Use the hashed token to verify OTP and sign in
        const { error: verifyError } = await supabase.auth.verifyOtp({
          type: 'magiclink',
          token_hash: data.token_hash,
        });

        if (verifyError) {
          toast({
            title: "Fehler",
            description: "Anmeldung fehlgeschlagen: " + verifyError.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Erfolg",
          description: "Wallet erfolgreich wiederhergestellt!",
        });
        onSuccess();
      }
    } catch (err) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-3 text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-foreground">Mit Seed Phrase wiederherstellen</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gib deine E-Mail und die 12 Wörter deiner Seed Phrase ein
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">E-Mail</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Seed Phrase</label>
          <div className="grid grid-cols-3 gap-2">
            {seedWords.map((word, index) => (
              <div key={index} className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground w-4 text-right">{index + 1}.</span>
                <Input
                  type="text"
                  value={word}
                  onChange={(e) => handleWordChange(index, e.target.value)}
                  onPaste={(e) => handlePaste(e, index)}
                  placeholder={`Wort ${index + 1}`}
                  className="h-9 text-sm px-2"
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-wallet-blue hover:bg-wallet-darkBlue text-white py-6 mt-4"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird verifiziert...
            </span>
          ) : (
            "Wallet wiederherstellen"
          )}
        </Button>
      </form>
    </div>
  );
};

export default SeedPhraseRecovery;
