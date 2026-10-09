import React from 'react';
import { ArrowDown, Mail, MapPin } from 'lucide-react';
import { Profile } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface HeroProps {
  profile: Profile;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 border-b border-subtleBorder">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Column 1: Introduction & Identity (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Meta tags / Academic indicator */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-[#EFEFEA] text-nearBlack text-xs font-medium tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-accentBlue animate-pulse"></span>
                <span>{profile.institution}</span>
              </span>
              <span className="inline-flex items-center space-x-1 text-xs text-neutralGray">
                <MapPin className="w-3.5 h-3.5 text-neutralGray" />
                <span>{profile.location}</span>
              </span>
            </div>

            {/* Name */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-nearBlack leading-[1.1] mb-4">
              {profile.fullName}
            </h1>

            {/* Professional Title */}
            <h2 className="text-lg sm:text-xl font-medium text-neutralGray mb-6">
              {profile.professionalTitle}
            </h2>

            {/* Editorial Introductory Text */}
            <p className="text-base sm:text-lg text-nearBlack/80 leading-relaxed font-normal max-w-xl mb-10">
              {profile.heroIntro}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center space-x-2 bg-nearBlack text-warmWhite hover:bg-black px-6 py-3 rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                <span>View Selected Projects</span>
                <ArrowDown className="w-4 h-4 stroke-[2]" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center space-x-2 bg-white text-nearBlack border border-subtleBorder hover:border-nearBlack px-6 py-3 rounded text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <Mail className="w-4 h-4 text-neutralGray" />
                <span>Get in Touch</span>
              </a>
            </div>
          </div>

          {/* Column 2: Profile Photograph Frame (5 cols on lg) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Subtle background offset frame */}
              <div className="absolute inset-0 translate-x-2 translate-y-2 border border-subtleBorder bg-warmWhite -z-10 rounded-sm"></div>
              
              {/* Main photograph wrapper */}
              <div className="border border-subtleBorder bg-white p-3 rounded-sm shadow-sm">
                <div className="aspect-[4/5] overflow-hidden bg-[#F4F4F0] flex items-center justify-center">
                  <ImageWithFallback
                    src={profile.profileImageUrl}
                    alt={`Portrait of ${profile.fullName}`}
                    className="w-full h-full object-cover object-top"
                    placeholderType="portrait"
                    fallbackText="John Yestin F. Cruz"
                  />
                </div>
                
                {/* Caption bar */}
                <div className="pt-3 pb-1 px-1 flex items-center justify-between text-[11px] text-neutralGray border-t border-subtleBorder/60 mt-3">
                  <span className="font-medium uppercase tracking-wider">Engineering Profile</span>
                  <span className="font-mono">{profile.yearLevel}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
