import React from 'react';
import { Profile } from '../types';
import { User, BookOpen, School, Calendar, MapPin } from 'lucide-react';

interface AboutProps {
  profile: Profile;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  const details = [
    { label: 'Full Name', value: profile.fullName, icon: User },
    { label: 'Program', value: 'Computer Engineering', icon: BookOpen },
    { label: 'Institution', value: profile.institution, icon: School },
    { label: 'Year Level', value: profile.yearLevel, icon: Calendar },
    { label: 'Location', value: profile.location, icon: MapPin },
  ];

  return (
    <section id="about" className="py-20 md:py-28 border-b border-subtleBorder scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-wider font-semibold text-accentBlue mb-2 block">
            01 / Background
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-nearBlack">
            About Me
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Biography Text (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-base sm:text-lg text-nearBlack/85 leading-relaxed font-normal whitespace-pre-line">
              {profile.biography}
            </p>
            
            <div className="pt-4 border-t border-subtleBorder/70 text-xs text-neutralGray leading-relaxed">
              Focus areas include embedded microcontrollers, sensor-actuator integration, schematic prototyping, and structured software systems designed for practical real-world operation.
            </div>
          </div>

          {/* Compact Information Panel (5 cols) */}
          <div className="lg:col-span-5">
            <div className="editorial-card p-6 rounded-sm">
              <h3 className="text-xs uppercase tracking-wider font-bold text-nearBlack pb-4 border-b border-subtleBorder mb-5">
                Academic & Profile Summary
              </h3>
              
              <dl className="space-y-4">
                {details.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start justify-between text-xs py-1">
                      <dt className="text-neutralGray font-medium flex items-center space-x-2">
                        <Icon className="w-3.5 h-3.5 text-neutralGray" />
                        <span>{item.label}</span>
                      </dt>
                      <dd className="text-nearBlack font-semibold text-right max-w-[220px]">
                        {item.value}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
