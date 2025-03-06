
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface UserSearchProps {
  onSelectAddress: (address: string) => void;
}

interface UserResult {
  id: string;
  username: string;
  walletAddress: string;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSelectAddress }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Bitte gib einen Suchbegriff ein",
        description: "Du musst einen Benutzernamen eingeben, um zu suchen.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Find profiles by username search
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .ilike('username', `%${searchTerm}%`)
        .limit(5);
      
      if (profileError) {
        console.error("Error searching users:", profileError);
        toast({
          title: "Fehler bei der Suche",
          description: profileError.message,
          variant: "destructive",
        });
        setIsSearching(false);
        return;
      }
      
      // Now fetch wallet addresses for these users
      if (profileData && profileData.length > 0) {
        const userIds = profileData.map(profile => profile.id);
        
        const { data: walletData, error: walletError } = await supabase
          .from('user_wallets')
          .select('user_id, wallet_address')
          .in('user_id', userIds);
        
        if (walletError) {
          console.error("Error fetching wallet addresses:", walletError);
          toast({
            title: "Fehler beim Abrufen der Wallet-Adressen",
            description: walletError.message,
            variant: "destructive",
          });
          setIsSearching(false);
          return;
        }
        
        // Combine the data
        const userResults: UserResult[] = profileData.map(profile => {
          const userWallet = walletData?.find(wallet => wallet.user_id === profile.id);
          return {
            id: profile.id,
            username: profile.username || 'Unknown User',
            walletAddress: userWallet?.wallet_address || ''
          };
        }).filter(user => user.walletAddress !== ''); // Only include users with a wallet address
        
        setResults(userResults);
      } else {
        setResults([]);
        toast({
          title: "Keine Ergebnisse",
          description: "Es wurden keine passenden Benutzer gefunden.",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten';
      console.error("Error in user search:", error);
      toast({
        title: "Fehler bei der Suche",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSelectUser = (address: string) => {
    onSelectAddress(address);
    setResults([]);
    setSearchTerm('');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Nach Benutzername suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? 'Sucht...' : 'Suchen'}
        </Button>
      </div>
      
      {results.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <ul className="divide-y">
            {results.map((user) => (
              <li 
                key={user.id} 
                className="p-3 hover:bg-muted cursor-pointer flex items-center justify-between"
                onClick={() => handleSelectUser(user.walletAddress)}
              >
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span>{user.username}</span>
                </div>
                <Button size="sm" variant="ghost">
                  Auswählen
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
