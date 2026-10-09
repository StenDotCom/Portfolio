import React from 'react';
import { ArrowUp, Lock } from 'lucide-react';

interface FooterProps {
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 bg-warmWhite border-t border-subtleBorder text-nearBlack">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left Side info */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-nearBlack">
            John Yestin F. Cruz
          </p>
          <p className="text-[11px] text-neutralGray mt-1">
            Computer Engineering Student | ICCT Colleges
          </p>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => {
              if (onNavigateToAdmin) {
                onNavigateToAdmin();
              } else {
                window.location.hash = '#admin';
              }
            }}
            className="inline-flex items-center space-x-1.5 text-[11px] uppercase tracking-wider text-neutralGray hover:text-nearBlack transition-colors"
          >
            <Lock className="w-3 h-3" />
            <span>Admin Dashboard</span>
          </button>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center space-x-1 text-[11px] uppercase tracking-wider text-neutralGray hover:text-nearBlack transition-colors border border-subtleBorder px-3 py-1.5 rounded"
            aria-label="Scroll back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

      </div>
    </footer>
  );
};
