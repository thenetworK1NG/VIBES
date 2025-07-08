
import React, { useState } from 'react';
import { User, Smile } from 'lucide-react';

const ProfileSetup = ({ onComplete }) => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🙂');

  const avatarOptions = ['🙂', '😊', '😄', '🤗', '🤔', '😎', '🤓', '👨‍💻', '👩‍💻', '🎮', '🎨', '🎵', '⚡', '🚀', '🌟', '💫'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !displayName.trim()) return;

    const userProfile = {
      id: '1',
      username: username.toLowerCase(),
      displayName,
      avatar: selectedAvatar,
      status: 'online'
    };

    onComplete(userProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">💬</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to ChatApp
          </h1>
          <p className="text-gray-600 mt-2">Create your profile to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Your Avatar
            </label>
            <div className="grid grid-cols-8 gap-2">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-2xl p-2 rounded-lg transition-all hover:scale-110 ${
                    selectedAvatar === avatar
                      ? 'bg-blue-100 ring-2 ring-blue-500'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
