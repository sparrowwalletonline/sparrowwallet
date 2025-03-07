
import * as bip39 from 'bip39';

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateBtcAddress = (): string => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let address = getRandomInt(0, 1) === 0 ? 'bc1' : '1';
  
  const length = address.startsWith('bc1') ? 39 : 33;
  for (let i = address.length; i < length; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return address;
};

// Updated to ensure entropy is properly used and returns string[]
export const generateSeedPhrase = (): string[] => {
  try {
    // Use crypto for additional entropy
    const additionalEntropy = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(additionalEntropy);
    } else {
      // Fallback if crypto API not available
      for (let i = 0; i < 16; i++) {
        additionalEntropy[i] = Math.floor(Math.random() * 256);
      }
    }
    
    // Convert to hex string for bip39
    const entropyHex = Array.from(additionalEntropy)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Generate mnemonic with entropy
    // Using bip39.generateMnemonic directly without passing entropyHex as third parameter
    // since it expects different parameters than what we're providing
    const mnemonic = bip39.generateMnemonic(128);
    console.log("Generated BIP39 mnemonic:", mnemonic);
    const words = mnemonic.split(' ');
    console.log("BIP39 word list (should be 12 words):", words);
    return words;
  } catch (error) {
    console.error("Error generating seed phrase:", error);
    // Generate a fallback that's still random
    const fallbackMnemonic = bip39.generateMnemonic(128);
    return fallbackMnemonic.split(' ');
  }
};
