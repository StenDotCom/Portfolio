import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Lock } from 'lucide-react';

interface NavbarProps {
  onNavigateToAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-warmWhite/95 backdrop-blur-md border-b border-subtleBorder py-3.5'
          : 'bg-warmWhite/80 backdrop-blur-sm border-b border-subtleBorder/60 py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Left Side: Name Branding */}
        <a
          href="#"
          className="group flex flex-col focus-visible:ring-2 focus-visible:ring-accentBlue focus-visible:outline-none"
        >
          <span className="text-sm font-bold tracking-wider uppercase text-nearBlack group-hover:text-accentBlue transition-colors">
            JOHN YESTIN F. CRUZ
          </span>
          <span className="text-[10px] tracking-wide text-neutralGray uppercase font-medium">
            Computer Engineering
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-wider font-medium text-neutralGray hover:text-nearBlack transition-colors focus-visible:ring-1 focus-visible:ring-accentBlue"
            >
              {link.label}
            </a>
          ))}

          {/* Let's Talk CTA */}
          <a
            href="#contact"
            className="inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-accentBlue hover:text-accentBlueHover transition-colors border border-accentBlue/30 px-3 py-1.5 rounded hover:border-accentBlue"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Admin Link */}
          <button
            onClick={() => {
              if (onNavigateToAdmin) {
                onNavigateToAdmin();
              } else {
                window.location.hash = '#admin';
              }
            }}
            className="text-neutralGray hover:text-nearBlack p-1.5 rounded transition-colors"
            title="Admin Dashboard"
            aria-label="Admin Dashboard"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center space-x-3 md:hidden">
          <button
            onClick={() => {
              if (onNavigateToAdmin) {
                onNavigateToAdmin();
              } else {
                window.location.hash = '#admin';
              }
            }}
            className="text-neutralGray hover:text-nearBlack p-2"
            title="Admin Dashboard"
            aria-label="Admin Dashboard"
          >
            <Lock className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-nearBlack hover:text-accentBlue transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accentBlue"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-warmWhite border-b border-subtleBorder px-6 py-6 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-4" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium uppercase tracking-wider text-neutralGray hover:text-nearBlack py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-subtleBorder flex items-center justify-between">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-accentBlue px-4 py-2 rounded hover:bg-accentBlueHover transition-colors"
              >
                <span>Let's Talk</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigateToAdmin) {
                    onNavigateToAdmin();
                  } else {
                    window.location.hash = '#admin';
                  }
                }}
                className="text-xs text-neutralGray hover:text-nearBlack flex items-center space-x-1 py-1"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Login</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
