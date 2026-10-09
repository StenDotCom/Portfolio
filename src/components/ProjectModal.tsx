import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Tag, Award, Layers, Target, Info } from 'lucide-react';
import { Project } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset active image when project changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [project]);

  // Handle keyboard navigation (Escape, ArrowLeft, ArrowRight)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!project) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (project.images.length > 1) {
          setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : project.images.length - 1));
        }
      } else if (e.key === 'ArrowRight') {
        if (project.images.length > 1) {
          setActiveImageIndex((prev) => (prev < project.images.length - 1 ? prev + 1 : 0));
        }
      }
    },
    [project, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    // Lock scroll on background body
    if (project) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown, project]);

  if (!project) return null;

  const images = project.images || [];
  const currentImage = images[activeImageIndex];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white border border-subtleBorder shadow-2xl rounded-sm my-8 overflow-hidden text-nearBlack"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-subtleBorder bg-warmWhite">
          <div className="flex items-center space-x-3 truncate mr-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-accentBlue">
              {project.category}
            </span>
            {project.status && (
              <>
                <span className="text-neutralGray/40">•</span>
                <span className="text-xs text-neutralGray font-medium truncate">
                  {project.status}
                </span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutralGray hover:text-nearBlack hover:bg-neutralGray/10 rounded transition-colors"
            aria-label="Close Case Study"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Title & Description */}
          <div>
            <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              {project.title}
            </h2>
            <p className="text-base text-nearBlack/80 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Project Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] bg-[#F4F4F0] border border-subtleBorder rounded-sm overflow-hidden flex items-center justify-center">
              {images.length > 0 && currentImage ? (
                <ImageWithFallback
                  src={currentImage.imageUrl}
                  alt={currentImage.caption || `${project.title} photograph ${activeImageIndex + 1}`}
                  className="w-full h-full object-contain"
                  placeholderType="project"
                  fallbackText={project.title}
                  category={project.category}
                />
              ) : (
                <ImageWithFallback
                  src={null}
                  alt={project.title}
                  className="w-full h-full"
                  placeholderType="project"
                  fallbackText="No Photographs Uploaded Yet"
                  category="Upload actual photographs via the Admin Dashboard"
                />
              )}

              {/* Prev / Next Controls if multiple images */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-nearBlack border border-subtleBorder shadow hover:bg-white transition-colors"
                    aria-label="Previous photograph"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-nearBlack border border-subtleBorder shadow hover:bg-white transition-colors"
                    aria-label="Next photograph"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Counter badge */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/75 text-white text-[11px] font-mono">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative flex-shrink-0 w-16 h-12 rounded border overflow-hidden transition-all ${
                      activeImageIndex === idx
                        ? 'border-accentBlue ring-2 ring-accentBlue/30'
                        : 'border-subtleBorder opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Technical Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-subtleBorder">
            
            {/* Objectives */}
            {project.objectives && (
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutralGray">
                  <Target className="w-3.5 h-3.5 text-accentBlue" />
                  <span>Project Objectives</span>
                </div>
                <p className="text-xs text-nearBlack/85 leading-relaxed">
                  {project.objectives}
                </p>
              </div>
            )}

            {/* Key Features */}
            {project.keyFeatures && (
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutralGray">
                  <Layers className="w-3.5 h-3.5 text-accentBlue" />
                  <span>Key Features & Mechanisms</span>
                </div>
                <p className="text-xs text-nearBlack/85 leading-relaxed">
                  {project.keyFeatures}
                </p>
              </div>
            )}

            {/* Contribution */}
            {project.contribution && (
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutralGray">
                  <Award className="w-3.5 h-3.5 text-accentBlue" />
                  <span>My Engineering Contribution</span>
                </div>
                <p className="text-xs text-nearBlack/85 leading-relaxed">
                  {project.contribution}
                </p>
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutralGray">
                  <Tag className="w-3.5 h-3.5 text-accentBlue" />
                  <span>Technologies & Tools</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] px-2.5 py-1 bg-warmWhite border border-subtleBorder text-nearBlack font-medium rounded-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Editorial Note */}
          <div className="p-3 bg-warmWhite border border-subtleBorder/80 rounded-sm flex items-start space-x-2 text-[11px] text-neutralGray">
            <Info className="w-4 h-4 flex-shrink-0 text-neutralGray mt-0.5" />
            <span>
              All project specifications and photographs reflect authentic academic and prototype engineering work documented by John Yestin F. Cruz.
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-subtleBorder bg-warmWhite flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-nearBlack text-warmWhite hover:bg-black rounded transition-colors"
          >
            Close Case Study
          </button>
        </div>

      </div>
    </div>
  );
};
