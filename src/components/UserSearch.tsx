
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserSearchProps {
  onSelectUser: (walletAddress: string, username: string) => void;
}

interface UserWithWallet {
  id: string;
  username: string;
  wallet_address: string;
}

export const UserSearch = ({ onSelectUser }: UserSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserWithWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchUsers();
    } else {
      setUsers([]);
    }
  }, [searchTerm]);

  const searchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // First get profiles where the username contains the search term
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .ilike('username', `%${searchTerm}%`)
        .limit(10);

      if (profilesError) {
        throw profilesError;
      }

      if (!profiles || profiles.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Get the wallet addresses for these users
      const userIds = profiles.map(profile => profile.id);
      const { data: wallets, error: walletsError } = await supabase
        .from('user_wallets')
        .select('user_id, wallet_address')
        .in('user_id', userIds);

      if (walletsError) {
        throw walletsError;
      }

      // Combine the data
      const usersWithWallets: UserWithWallet[] = profiles
        .filter(profile => wallets?.some(wallet => wallet.user_id === profile.id))
        .map(profile => {
          const wallet = wallets?.find(w => w.user_id === profile.id);
          return {
            id: profile.id,
            username: profile.username || 'Unnamed User',
            wallet_address: wallet?.wallet_address || ''
          };
        })
        .filter(user => user.wallet_address); // Only include users with a wallet address

      setUsers(usersWithWallets);
    } catch (err) {
      console.error('Error searching for users:', err);
      setError('Failed to search for users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="text-destructive text-sm py-2">{error}</div>
      )}

      {!loading && users.length === 0 && searchTerm.length >= 2 && (
        <div className="text-muted-foreground text-sm py-2">
          No users found with that username
        </div>
      )}

      {users.length > 0 && (
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {users.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => onSelectUser(user.wallet_address, user.username)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{user.username}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[220px]">
                    {user.wallet_address}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
