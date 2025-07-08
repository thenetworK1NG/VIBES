
import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UserSearch = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const { toast } = useToast();

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .neq('id', currentUser.id)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      toast({
        title: "Search Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (friendId) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: currentUser.id,
          friend_id: friendId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Friend request sent!",
        description: "Your friend request has been sent successfully.",
      });

      // Remove user from search results
      setSearchResults(prev => prev.filter(user => user.id !== friendId));
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loadFriendRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          profiles:user_id (username, display_name, avatar_url)
        `)
        .eq('friend_id', currentUser.id)
        .eq('status', 'pending');

      if (error) throw error;
      setFriendRequests(data || []);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    }
  };

  const respondToFriendRequest = async (requestId, accept) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: accept ? 'accepted' : 'blocked' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: accept ? "Friend request accepted!" : "Friend request declined",
        description: accept ? "You are now friends!" : "Friend request has been declined.",
      });

      loadFriendRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadFriendRequests();
  }, [currentUser.id]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="p-4 space-y-6">
      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Friend Requests</h3>
          <div className="space-y-2">
            {friendRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-xl">{request.profiles?.avatar_url || '👤'}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{request.profiles?.display_name}</h4>
                    <p className="text-sm text-gray-500">@{request.profiles?.username}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => respondToFriendRequest(request.id, true)}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => respondToFriendRequest(request.id, false)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Section */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Find Friends</h3>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or username..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="text-gray-500">Searching...</div>
          </div>
        )}

        <div className="space-y-2">
          {searchResults.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="text-xl">{user.avatar_url || '👤'}</div>
                <div>
                  <h4 className="font-medium text-gray-900">{user.display_name}</h4>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
              <button
                onClick={() => sendFriendRequest(user.id)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <UserPlus size={16} />
                <span>Add</span>
              </button>
            </div>
          ))}
        </div>

        {searchQuery && !loading && searchResults.length === 0 && (
          <div className="text-center py-4">
            <div className="text-gray-500">No users found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
