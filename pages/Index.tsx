
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ChatInterface from '../components/ChatInterface';
import ContactManager from '../components/ContactManager';
import UserSearch from '../components/UserSearch';
import ProfileEditor from '../components/ProfileEditor';
import Auth from '../components/Auth';
import { User, MessageCircle, Users, Settings, Search, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentView, setCurrentView] = useState('chat');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setUser(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setUser(updatedProfile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={loadUserProfile} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto flex h-screen">
        {/* Sidebar Navigation */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200 flex flex-col">
          {/* User Profile Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {profile?.avatar_url?.startsWith('http') ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="text-2xl">{profile?.avatar_url || '🙂'}</div>
                )}
                <div>
                  <h3 className="font-semibold">{profile?.display_name}</h3>
                  <p className="text-blue-100 text-sm">@{profile?.username}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setCurrentView('chat')}
              className={`flex-1 flex items-center justify-center p-3 space-x-2 transition-colors ${
                currentView === 'chat' 
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MessageCircle size={20} />
              <span>Chats</span>
            </button>
            <button
              onClick={() => setCurrentView('contacts')}
              className={`flex-1 flex items-center justify-center p-3 space-x-2 transition-colors ${
                currentView === 'contacts' 
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users size={20} />
              <span>Friends</span>
            </button>
          </div>

          {/* Secondary Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setCurrentView('search')}
              className={`flex-1 flex items-center justify-center p-2 space-x-1 transition-colors ${
                currentView === 'search' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Search size={16} />
              <span className="text-sm">Search</span>
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className={`flex-1 flex items-center justify-center p-2 space-x-1 transition-colors ${
                currentView === 'profile' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings size={16} />
              <span className="text-sm">Profile</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {currentView === 'contacts' && <ContactManager user={user} />}
            {currentView === 'search' && <UserSearch currentUser={user} />}
            {currentView === 'profile' && (
              <ProfileEditor user={profile} onUpdate={handleProfileUpdate} />
            )}
            {currentView === 'chat' && (
              <div className="p-4 space-y-3">
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">No chats yet</div>
                  <p className="text-sm text-gray-400">Add friends to start chatting!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatInterface user={user} />
        </div>
      </div>
    </div>
  );
};

export default Index;
