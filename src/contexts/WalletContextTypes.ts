
import { Session } from '@supabase/supabase-js';
import { CryptoPrice } from '../utils/cryptoPriceUtils';

export interface Wallet {
  id: string;
  name: string;
  seedPhrase: string[];
  walletAddress: string;
  btcBalance: number;
  ethBalance: number;
  isActive: boolean;
}

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
  isRefreshingPrices: boolean;
  cryptoPrices: Record<string, CryptoPrice>;
  wallets: Wallet[];
  activeWallet: Wallet | null;
  enabledCryptos: string[];
  refreshPrices: () => Promise<Record<string, CryptoPrice>>;
  generateWallet: (stage?: string) => void;
  createWallet: () => void;
  cancelWalletCreation: () => void;
  importWallet: (phrase: string | string[]) => void;
  resetWallet: () => void;
  copyToClipboard: (text: string) => void;
  saveToSupabase: () => Promise<boolean>;
  loadFromSupabase: () => Promise<boolean>;
  addNewWallet: (name: string) => void;
  setActiveWallet: (walletId: string) => void;
  updateEnabledCryptos: (cryptoIds: string[]) => void;
  deleteWallet: (walletId: string) => void;
}
