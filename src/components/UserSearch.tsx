
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, User } from 'lucide-react';

interface UserSearchProps {
  onSelectUser: (address: string, username: string) => void;
}

interface UserResult {
  id: string;
  email: string;
  wallet_address: string;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<UserResult[]>([]);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchQuery.trim().length >= 3) {
        handleSearch();
      } else {
        setResults([]);
        setNoResults(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 3) return;
    
    setIsSearching(true);
    setNoResults(false);
    
    try {
      // Search for users where email contains the search query
      const { data, error } = await supabase
        .from('users')
        .select('id, email, user_wallets!inner(wallet_address)')
        .ilike('email', `%${searchQuery}%`)
        .limit(5);
      
      if (error) throw error;
      
      const formattedResults = data
        ? data.map(user => ({
            id: user.id,
            email: user.email,
            wallet_address: user.user_wallets[0]?.wallet_address || ''
          }))
        : [];
      
      setResults(formattedResults);
      setNoResults(formattedResults.length === 0);
    } catch (error) {
      console.error("Error searching users:", error);
      setResults([]);
      setNoResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  const getUsernameFromEmail = (email: string) => {
    return email.split('@')[0];
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="user-search">Nutzer suchen</Label>
        <div className="relative">
          <Input
            id="user-search"
            placeholder="E-Mail-Adresse eingeben"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>
      
      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Ergebnisse</p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {results.map((user) => (
              <div
                key={user.id}
                className="p-3 border rounded-md flex justify-between items-center hover:bg-accent cursor-pointer"
                onClick={() => onSelectUser(user.wallet_address, getUsernameFromEmail(user.email))}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{getUsernameFromEmail(user.email)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate max-w-[220px]">
                    {user.wallet_address}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Auswählen
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {noResults && searchQuery.trim().length >= 3 && (
        <div className="text-center p-4 text-muted-foreground">
          Keine Benutzer gefunden
        </div>
      )}

      {searchQuery.trim().length < 3 && searchQuery.trim().length > 0 && (
        <div className="text-center p-4 text-muted-foreground">
          Bitte gib mindestens 3 Zeichen ein
        </div>
      )}
    </div>
  );
};
