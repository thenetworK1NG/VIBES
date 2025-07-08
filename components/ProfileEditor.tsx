
import React, { useState } from 'react';
import { Camera, Save, User, Mail, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ProfileEditor = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    display_name: user?.display_name || '',
    bio: user?.bio || '',
    avatar_url: user?.avatar_url || '🙂'
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { toast } = useToast();

  const emojis = ['😊', '😎', '🤔', '😍', '🥳', '🤓', '😇', '🙃', '😋', '🤗', '🙂', '😌', '😁', '🤠', '🤡', '🤖', '👻', '💀', '🎃', '🎭', '🎪', '🎨', '🎯', '🎮', '🎲', '🎪', '🎨', '🎯', '🎮'];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmojiSelect = (emoji) => {
    setFormData({
      ...formData,
      avatar_url: emoji
    });
    setShowEmojiPicker(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData({
        ...formData,
        avatar_url: publicUrl
      });

      toast({
        title: "Avatar uploaded!",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          display_name: formData.display_name,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });

      onUpdate(data);
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {formData.avatar_url?.startsWith('http') ? (
                <img
                  src={formData.avatar_url}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-3xl border-4 border-white shadow-lg">
                  {formData.avatar_url}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute -bottom-2 -right-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleEmojiSelect(emoji)}
                      className="text-2xl hover:bg-gray-100 p-2 rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="border-t pt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or upload a photo:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Display Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="display_name"
              value={formData.display_name}
              onChange={handleInputChange}
              placeholder="Display Name"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Bio */}
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={user?.email || ''}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              disabled
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            <Save size={20} />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditor;
