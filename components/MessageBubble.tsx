
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const MessageBubble = ({ message, isOwn }) => {
  const formatTime = (timestamp) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="max-w-xs">
            <img
              src={URL.createObjectURL(message.content)}
              alt="Shared image"
              className="rounded-lg max-w-full h-auto"
            />
          </div>
        );
      case 'video':
        return (
          <div className="max-w-xs">
            <video
              src={URL.createObjectURL(message.content)}
              controls
              className="rounded-lg max-w-full h-auto"
            />
          </div>
        );
      default:
        return (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        );
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {!isOwn && (
          <div className="text-lg mb-1">{message.sender.avatar}</div>
        )}
        
        <div className="flex flex-col">
          {!isOwn && (
            <span className="text-xs text-gray-500 mb-1 px-1">
              {message.sender.displayName}
            </span>
          )}
          
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
            } shadow-sm`}
          >
            {renderContent()}
            
            <p className={`text-xs mt-1 ${
              isOwn ? 'text-blue-100' : 'text-gray-400'
            }`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
        
        {isOwn && (
          <div className="text-lg mb-1">{message.sender.avatar}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
