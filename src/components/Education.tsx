import React from 'react';
import { Education as EducationType } from '../types';
import { GraduationCap, School, MapPin } from 'lucide-react';

interface EducationProps {
  education: EducationType[];
}

export const Education: React.FC<EducationProps> = ({ education }) => {
  return (
    <section id="education" className="py-20 md:py-28 border-b border-subtleBorder scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-wider font-semibold text-accentBlue mb-2 block">
            04 / Academic Program
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-nearBlack">
            Education
          </h2>
        </div>

        {/* Education Timeline / Cards */}
        <div className="space-y-6 max-w-3xl">
          {education.map((item) => (
            <div
              key={item.id}
              className="editorial-card p-6 sm:p-8 rounded-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-subtleBorder mb-5 gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded bg-warmWhite border border-subtleBorder flex items-center justify-center text-accentBlue">
                    <GraduationCap className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-nearBlack">
                      {item.program}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-neutralGray">
                      <School className="w-3.5 h-3.5" />
                      <span>{item.institution}</span>
                    </div>
                  </div>
                </div>

                <div className="self-start sm:self-center">
                  <span className="inline-block px-3 py-1 bg-warmWhite border border-subtleBorder text-nearBlack text-xs font-mono font-medium rounded-sm">
                    {item.yearLevel}
                  </span>
                </div>
              </div>

              {item.details && (
                <p className="text-xs sm:text-sm text-nearBlack/80 leading-relaxed font-normal">
                  {item.details}
                </p>
              )}

              <div className="flex items-center space-x-1.5 text-[11px] text-neutralGray mt-4 pt-3 border-t border-subtleBorder/50">
                <MapPin className="w-3.5 h-3.5" />
                <span>Philippines • Verified Academic Program</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
