import React from 'react';

interface AdSectionProps {
  adSlot: string; // AdSense slot ID
  className?: string;
}

export const AdSection: React.FC<AdSectionProps> = ({ adSlot, className = "" }) => {
  return (
    <div 
      className={`my-4 p-2 bg-slate-100 rounded-lg flex justify-center items-center ${className}`}
      role="region"
      aria-label="Advertisement"
    >
      {/* 
        In a real production environment, you would use the <ins> tag 
        provided by Google AdSense. 
        This is a placeholder for the implementation.
      */}
      <div className="text-xs text-slate-500 italic">Advertisement</div>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossOrigin="anonymous"
      ></script>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};
