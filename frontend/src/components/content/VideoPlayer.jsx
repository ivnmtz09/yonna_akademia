import React from 'react';
import { Play } from 'lucide-react';

const VideoPlayer = ({ src, title, onTimeUpdate }) => {
  const handleTimeUpdate = (e) => {
    if (onTimeUpdate) {
      onTimeUpdate(Math.floor(e.target.currentTime));
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-900 aspect-video group">
        <video
          controls
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          poster="/yonna.png" // Opcional: podrías pasar una prop para el poster
        >
          <source src={src} type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
      
      {title && (
        <div className="flex items-start gap-2 px-1">
          <div className="mt-1 p-1 bg-brand-light rounded-full text-brand-dark">
            <Play size={12} fill="currentColor" />
          </div>
          <p className="text-sm font-medium text-slate-600 leading-snug">
            {title}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;