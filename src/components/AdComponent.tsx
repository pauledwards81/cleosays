
import React, { useEffect, useRef } from 'react';

interface AdComponentProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

const AdComponent: React.FC<AdComponentProps> = ({ 
  adSlot, 
  adFormat = 'auto', 
  style = {}, 
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    try {
      // Reduced delay time for faster initialization
      const adInitTimeout = setTimeout(() => {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle.push({});
          console.log('AdSense push successful');
        } else {
          console.log('AdSense not loaded yet');
        }
      }, 50); // Reduced from typical 100-300ms to 50ms
      
      return () => clearTimeout(adInitTimeout);
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [adSlot, adFormat]);

  return (
    <div 
      className={`ad-container ${className}`} 
      style={{
        minHeight: '90px', // Reduced minimum height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f9f9f9',
        margin: '5px 0', // Reduced margin
        overflow: 'hidden',
        ...style
      }}
    >
      <div ref={containerRef}>
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'block', 
            width: '100%',
            height: '100%',
            minWidth: '200px', // Reduced minimum width
            minHeight: '90px'
          }}
          data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
};

export default AdComponent;
