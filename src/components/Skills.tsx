import React from 'react';
import { Skill } from '../types';
import { Code, Cpu, Layout, GitBranch } from 'lucide-react';

interface SkillsProps {
  skills: Skill[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  // Group skills by category
  const categories = [
    { name: 'Programming and Web', icon: Code },
    { name: 'Hardware and Engineering', icon: Cpu },
    { name: 'Design and Productivity', icon: Layout },
    { name: 'Development Platform', icon: GitBranch },
  ];

  // Also collect any custom categories added via admin
  const allCategoryNames = Array.from(new Set(skills.map((s) => s.category)));
  const extraCategories = allCategoryNames.filter(
    (name) => !categories.some((c) => c.name === name)
  );

  return (
    <section id="skills" className="py-20 md:py-28 border-b border-subtleBorder scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-wider font-semibold text-accentBlue mb-2 block">
            03 / Competencies
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-nearBlack">
            Technical Skills
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const categorySkills = skills.filter((s) => s.category === cat.name);

            return (
              <div
                key={cat.name}
                className="editorial-card p-6 rounded-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2.5 pb-4 border-b border-subtleBorder mb-5">
                    <Icon className="w-4 h-4 text-accentBlue stroke-[2]" />
                    <h3 className="text-xs uppercase tracking-wider font-bold text-nearBlack">
                      {cat.name}
                    </h3>
                  </div>

                  <ul className="space-y-2.5">
                    {categorySkills.map((skill) => (
                      <li
                        key={skill.id}
                        className="text-xs font-medium text-nearBlack/85 flex items-center space-x-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-subtleBorderHover"></span>
                        <span>{skill.name}</span>
                      </li>
                    ))}
                    {categorySkills.length === 0 && (
                      <li className="text-xs text-neutralGray italic">
                        No skills listed in category
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            );
          })}

          {/* Any custom categories created by admin */}
          {extraCategories.map((catName) => {
            const categorySkills = skills.filter((s) => s.category === catName);
            return (
              <div
                key={catName}
                className="editorial-card p-6 rounded-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2.5 pb-4 border-b border-subtleBorder mb-5">
                    <Code className="w-4 h-4 text-accentBlue stroke-[2]" />
                    <h3 className="text-xs uppercase tracking-wider font-bold text-nearBlack">
                      {catName}
                    </h3>
                  </div>

                  <ul className="space-y-2.5">
                    {categorySkills.map((skill) => (
                      <li
                        key={skill.id}
                        className="text-xs font-medium text-nearBlack/85 flex items-center space-x-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-subtleBorderHover"></span>
                        <span>{skill.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
