
import React, { useEffect } from 'react';

interface AdSenseProps {
  adClient: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
}

const AdSense: React.FC<AdSenseProps> = ({ 
  adClient, 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  className = "" 
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className={`overflow-hidden rounded-2xl my-8 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      ></ins>
    </div>
  );
};

export default AdSense;
