
import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, Phone, Video, MoreVertical } from 'lucide-react';

interface ChatInterfaceProps {
  user: any;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! How are you doing today?",
      sender: "other",
      timestamp: "2:30 PM",
      avatar: "😊"
    },
    {
      id: 2,
      text: "I'm doing great! Just working on some projects. How about you?",
      sender: "me",
      timestamp: "2:32 PM"
    },
    {
      id: 3,
      text: "Same here! Working on a new chat app. It's pretty exciting!",
      sender: "other",
      timestamp: "2:33 PM",
      avatar: "😊"
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">😊</div>
          <div>
            <h3 className="font-semibold text-gray-900">Alex Johnson</h3>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.sender === 'me' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {message.sender === 'other' && (
                <div className="text-xl">{message.avatar}</div>
              )}
              <div className={`px-4 py-2 rounded-2xl ${
                message.sender === 'me' 
                  ? 'bg-blue-500 text-white rounded-br-md' 
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Paperclip size={20} className="text-gray-600" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Smile size={20} className="text-gray-600" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
          >
            <Send size={20} className="text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
