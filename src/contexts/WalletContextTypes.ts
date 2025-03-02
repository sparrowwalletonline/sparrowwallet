
import { Session } from '@supabase/supabase-js';

export interface WalletContextType {
  hasWallet: boolean;
  seedPhrase: string[];
  balance: number;
  btcBalance: number;
  btcPrice: number;
  ethBalance: number;
  ethPrice: number;
  usdBalance: number;
  walletAddress: string;
  isGenerating: boolean;
  session: Session | null;
  generateWallet: (stage?: string) => void;
  createWallet: () => void;
  cancelWalletCreation: () => void;
  importWallet: (phrase: string | string[]) => void;
  resetWallet: () => void;
  copyToClipboard: (text: string) => void;
  saveToSupabase: () => Promise<boolean>;
  loadFromSupabase: () => Promise<boolean>;
}
