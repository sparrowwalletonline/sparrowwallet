
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Loader2, Search, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserSearchProps {
  onSelectUser: (address: string, username: string) => void;
}

interface UserResult {
  id: string;
  username: string;
  wallet_address: string;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<UserResult[]>([]);
  const [noResults, setNoResults] = useState(false);
  
  const handleSearch = async () => {
    if (!searchQuery || searchQuery.length < 2) {
      return;
    }
    
    setIsSearching(true);
    setResults([]);
    setNoResults(false);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          user_wallets!inner (
            wallet_address
          )
        `)
        .ilike('username', `%${searchQuery}%`)
        .limit(5);

      if (error) throw error;

      if (data && Array.isArray(data)) {
        const formattedResults = data
          .map(profile => ({
            id: profile.id,
            username: profile.username || '',
            wallet_address: profile.user_wallets && 
                           profile.user_wallets.length > 0 ? 
                           profile.user_wallets[0].wallet_address : ''
          }))
          .filter(result => result.wallet_address !== ''); // Only include users with wallets
        
        setResults(formattedResults);
        setNoResults(formattedResults.length === 0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setNoResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="user-search">Nutzername suchen</Label>
        <div className="relative">
          <Input
            id="user-search"
            placeholder="Benutzernamen eingeben"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-0 h-full" 
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map(user => (
            <div
              key={user.id}
              className="p-3 border rounded-md flex justify-between items-center hover:bg-accent cursor-pointer"
              onClick={() => onSelectUser(user.wallet_address, user.username)}
            >
              <div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.username}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate max-w-[220px]">
                  {user.wallet_address}
                </div>
              </div>
              <Button size="sm" variant="ghost">Auswählen</Button>
            </div>
          ))}
        </div>
      )}
      
      {noResults && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Keine Benutzer gefunden. Versuche es mit einem anderen Suchmuster.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UserSearch;
