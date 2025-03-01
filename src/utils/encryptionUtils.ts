
export const encryptSeedPhrase = (phrase: string[]): string => {
  try {
    // Very basic encryption - NOT for production use
    return btoa(JSON.stringify(phrase));
  } catch (error) {
    console.error("Error encrypting seed phrase:", error);
    return "";
  }
};

export const decryptSeedPhrase = (encryptedPhrase: string): string[] => {
  try {
    // Very basic decryption - NOT for production use
    return JSON.parse(atob(encryptedPhrase));
  } catch (error) {
    console.error("Error decrypting seed phrase:", error);
    return [];
  }
};
