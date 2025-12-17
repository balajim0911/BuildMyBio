import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
       {/* Paper Fold/Back (Left side curl) */}
       <path
         d="M50 20 Q30 30 30 50 V130 Q60 120 50 120"
         fill="#D1D5DB"
         stroke="#9CA3AF"
         strokeWidth="3"
         strokeLinecap="round"
         strokeLinejoin="round"
       />

       {/* Paper Scroll Main Body */}
       <path
         d="M50 20 Q90 10 120 25 V120 Q90 105 50 120 V20 Z"
         fill="#F3F4F6"
         stroke="#9CA3AF"
         strokeWidth="3"
         strokeLinecap="round"
         strokeLinejoin="round"
       />

       {/* Lines on Paper */}
       <line x1="65" y1="45" x2="105" y2="45" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
       <line x1="65" y1="60" x2="105" y2="60" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
       <line x1="65" y1="75" x2="95" y2="75" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>

       {/* Signature Loop */}
       <path d="M70 100 Q80 90 85 105 T100 100" stroke="#9CA3AF" strokeWidth="3" fill="none" strokeLinecap="round" />

       {/* Pen Body */}
       <path
         d="M110 60 L90 95 L98 100 L118 65 Z"
         fill="#9CA3AF"
       />
       {/* Pen Tip */}
       <path d="M90 95 L86 102 L98 100" fill="#4B5563" />

       {/* Hand (Blue) */}
       <path
         d="M110 65 C100 70 100 85 110 90 C120 95 130 90 135 80 L170 70 V40 L135 50 C125 45 115 60 110 65 Z"
         fill="#5B7C99"
         stroke="#4A657D"
         strokeWidth="1"
       />
       {/* Knuckle Detail */}
       <circle cx="110" cy="65" r="5" fill="#5B7C99"/>
    </svg>
  );
};

export default Logo;