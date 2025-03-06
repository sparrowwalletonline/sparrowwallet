
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
  // Adding history for wallet balances
  balanceHistory?: PriceHistory[];
}

export interface PriceHistory {
  timestamp: number;
  price: number;
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
  saveWalletAddressToUserAccount: () => Promise<boolean>;
  loadWalletFromUserAccount: () => Promise<boolean>;
  logout: () => Promise<void>;
  // PIN-related properties
  pinProtectionEnabled: boolean;
  requirePinVerification: boolean;
  setRequirePinVerification: (value: boolean) => void;
  verifyPin: (pin: string) => boolean;
  setPinProtectionEnabled: (value: boolean) => void;
  setPin: (pin: string) => void;
  pinVerified: boolean;
  setPinVerified: (value: boolean) => void;
  // Adding functions for Bitcoin balance management
  updateWalletBtcBalance: (walletId: string, amount: number) => void;
}
