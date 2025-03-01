
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

export const generateSeedPhrase = (): string[] => {
  try {
    const mnemonic = bip39.generateMnemonic(128);
    console.log("Generated BIP39 mnemonic:", mnemonic);
    const words = mnemonic.split(' ');
    console.log("BIP39 word list (should be 12 words):", words);
    return words;
  } catch (error) {
    console.error("Error generating seed phrase:", error);
    return ["ability", "dinner", "canvas", "trash", "paper", "volcano", "energy", "horse", "author", "basket", "melody", "vintage"];
  }
};
