import React, { useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  placeholderType?: 'portrait' | 'project';
  fallbackText?: string;
  category?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  placeholderType = 'project',
  fallbackText,
  category,
}) => {
  const [hasError, setHasError] = useState(false);

  // If source is provided and didn't error, render the actual image
  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    );
  }

  // Neutral, high-taste architectural placeholder
  if (placeholderType === 'portrait') {
    return (
      <div
        className={`bg-[#F4F4F0] border border-subtleBorder flex flex-col items-center justify-center text-center p-8 select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-16 h-16 rounded-full border border-subtleBorder bg-white flex items-center justify-center text-neutralGray mb-4">
          <Camera className="w-6 h-6 stroke-[1.5]" />
        </div>
        <p className="text-xs uppercase tracking-wider text-neutralGray font-medium">
          {fallbackText || 'Profile Photograph Placeholder'}
        </p>
        <span className="text-[11px] text-[#888888] mt-1 max-w-[200px]">
          Upload actual photo via Admin Dashboard
        </span>
      </div>
    );
  }

  return (
    <div
      className={`bg-[#F4F4F0] border border-subtleBorder flex flex-col items-center justify-center text-center p-6 select-none ${className}`}
      role="img"
      aria-label={alt}
    >
      <div className="w-12 h-12 rounded border border-subtleBorder bg-white flex items-center justify-center text-neutralGray mb-3">
        <ImageIcon className="w-5 h-5 stroke-[1.5]" />
      </div>
      <p className="text-xs uppercase tracking-wider text-neutralGray font-medium">
        {fallbackText || 'Project Image Pending Upload'}
      </p>
      {category && (
        <span className="text-[11px] text-[#888888] mt-1">
          {category}
        </span>
      )}
    </div>
  );
};
