
import React, { useRef } from 'react';
import { Image, Video, X } from 'lucide-react';

const MediaUpload = ({ onUpload, onClose }) => {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      onUpload(file, type);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 m-4 max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Share Media</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => imageInputRef.current?.click()}
            className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Image className="text-blue-600" size={24} />
            <span className="text-blue-600 font-medium">Share Photo</span>
          </button>
          
          <button
            onClick={() => videoInputRef.current?.click()}
            className="w-full flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <Video className="text-purple-600" size={24} />
            <span className="text-purple-600 font-medium">Share Video</span>
          </button>
        </div>
        
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'image')}
          className="hidden"
        />
        
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => handleFileUpload(e, 'video')}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default MediaUpload;
