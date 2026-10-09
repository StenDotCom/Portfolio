import React, { useState } from 'react';
import { Project } from '../types';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { ProjectModal } from './ProjectModal';

interface ProjectsProps {
  projects: Project[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-20 md:py-28 border-b border-subtleBorder scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-accentBlue mb-2 block">
              02 / Engineering Work
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-nearBlack">
              Selected Projects
            </h2>
          </div>
          <p className="text-xs text-neutralGray mt-3 sm:mt-0 font-medium">
            Showing {projects.length} Engineering & Software Prototypes
          </p>
        </div>

        {/* 2-Column Grid on Desktop, 1-Column on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project, index) => {
            const mainImage = project.images.find((img) => img.isMain) || project.images[0];
            const indexFormatted = String(index + 1).padStart(2, '0');

            return (
              <article
                key={project.id}
                className="group editorial-card flex flex-col justify-between overflow-hidden rounded-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <div>
                  {/* Image Container with aspect ratio preservation */}
                  <div className="relative aspect-[16/10] bg-[#F4F4F0] border-b border-subtleBorder overflow-hidden">
                    <ImageWithFallback
                      src={mainImage?.imageUrl}
                      alt={`${project.title} Preview`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      placeholderType="project"
                      fallbackText={project.title}
                      category={project.category}
                    />

                    {/* Editorial Number Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 border border-subtleBorder text-nearBlack text-xs font-mono font-medium px-2 py-0.5 rounded-sm">
                      {indexFormatted}
                    </div>

                    {/* Image Count indicator if multiple */}
                    {project.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/75 text-white text-[11px] font-mono px-2 py-0.5 rounded-sm">
                        {project.images.length} photos
                      </div>
                    )}
                  </div>

                  {/* Content area */}
                  <div className="p-6 sm:p-7">
                    
                    {/* Category & Status */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="uppercase tracking-wider font-semibold text-accentBlue">
                        {project.category}
                      </span>
                      {project.status && (
                        <span className="text-neutralGray font-medium text-[11px]">
                          {project.status}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-nearBlack group-hover:text-accentBlue transition-colors mb-3">
                      {project.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-neutralGray leading-relaxed mb-6 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technology tags */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] font-mono px-2 py-0.5 bg-warmWhite border border-subtleBorder text-nearBlack/80 rounded-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>
                </div>

                {/* Card Action Link */}
                <div className="px-6 pb-6 pt-0">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full inline-flex items-center justify-between border-t border-subtleBorder pt-4 text-xs font-semibold uppercase tracking-wider text-nearBlack group-hover:text-accentBlue transition-colors"
                  >
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-4 h-4 text-neutralGray group-hover:text-accentBlue group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty state if all projects deleted */}
        {projects.length === 0 && (
          <div className="editorial-card p-12 text-center rounded-sm">
            <FolderGit2 className="w-10 h-10 text-neutralGray mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-nearBlack mb-1">
              No Projects Listed
            </h3>
            <p className="text-xs text-neutralGray">
              Projects added in the Admin Dashboard will appear here.
            </p>
          </div>
        )}

      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
