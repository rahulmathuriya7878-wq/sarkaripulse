import React from 'react';
import { Share2 } from 'lucide-react';

interface FloatingShareButtonProps {
  title?: string;
  text?: string;
}

export const FloatingShareButton: React.FC<FloatingShareButtonProps> = ({ title, text }) => {
  const handleShare = async () => {
    const shareData = {
      title: title || document.title,
      text: text || 'सरकारी नौकरियों और अपडेट्स के लिए SarkariPulse देखें।',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== 'AbortError' && err.message !== 'Share canceled') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback: Copy to clipboard or simple alert
      alert(`Title: ${shareData.title}\nURL: ${shareData.url}`);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
      aria-label="Share this page"
    >
      <Share2 className="w-6 h-6" />
    </button>
  );
};
