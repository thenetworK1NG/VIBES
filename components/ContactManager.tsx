
import React, { useState } from 'react';
import { UserPlus, Search, Users } from 'lucide-react';

const ContactManager = ({ user }) => {
  const [searchUsername, setSearchUsername] = useState('');
  const [friends, setFriends] = useState([
    {
      id: '2',
      username: 'alex',
      displayName: 'Alex',
      avatar: '😊',
      status: 'online'
    },
    {
      id: '3',
      username: 'sarah_dev',
      displayName: 'Sarah',
      avatar: '👩‍💻',
      status: 'away'
    },
    {
      id: '4',
      username: 'mike_gamer',
      displayName: 'Mike',
      avatar: '🎮',
      status: 'offline'
    }
  ]);

  const addFriend = () => {
    if (!searchUsername.trim()) return;
    
    // Mock adding friend - in real app this would make an API call
    const mockFriend = {
      id: Date.now().toString(),
      username: searchUsername,
      displayName: searchUsername.charAt(0).toUpperCase() + searchUsername.slice(1),
      avatar: '🙂',
      status: 'online'
    };
    
    setFriends(prev => [...prev, mockFriend]);
    setSearchUsername('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Add Friend Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <UserPlus className="mr-2" size={18} />
          Add Friend
        </h3>
        
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Enter username..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addFriend()}
            />
          </div>
          
          <button
            onClick={addFriend}
            disabled={!searchUsername.trim()}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Friends List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Users className="mr-2" size={18} />
            Friends ({friends.length})
          </h3>
          
          <div className="space-y-2">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center space-x-3 p-3 bg-white hover:bg-blue-50 rounded-lg cursor-pointer transition-colors border border-gray-100"
              >
                <div className="relative">
                  <div className="text-xl">{friend.avatar}</div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(friend.status)}`}
                  />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{friend.displayName}</h4>
                  <p className="text-sm text-gray-500">@{friend.username}</p>
                </div>
                
                <div className="text-xs text-gray-400 capitalize">
                  {friend.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactManager;
