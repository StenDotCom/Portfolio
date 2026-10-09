import React, { useState, useRef } from 'react';
import { Project, ProjectImage } from '../types';
import { DataService, validateImageFile } from '../lib/storage';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Save, 
  Check, 
  AlertTriangle,
  FolderPlus,
  Tag
} from 'lucide-react';

interface ProjectsManagerProps {
  projects: Project[];
  onRefresh: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  onRefresh,
  showToast,
}) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formObjectives, setFormObjectives] = useState('');
  const [formKeyFeatures, setFormKeyFeatures] = useState('');
  const [formContribution, setFormContribution] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [formTechInput, setFormTechInput] = useState('');
  const [formTechnologies, setFormTechnologies] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Image Upload State
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCreate = () => {
    setIsCreatingNew(true);
    setEditingProject(null);
    setFormTitle('');
    setFormCategory('Embedded Systems Prototype');
    setFormDescription('');
    setFormObjectives('');
    setFormKeyFeatures('');
    setFormContribution('');
    setFormStatus('Prototype');
    setFormTechInput('');
    setFormTechnologies([]);
  };

  const startEdit = (p: Project) => {
    setIsCreatingNew(false);
    setEditingProject(p);
    setFormTitle(p.title);
    setFormCategory(p.category);
    setFormDescription(p.description);
    setFormObjectives(p.objectives || '');
    setFormKeyFeatures(p.keyFeatures || '');
    setFormContribution(p.contribution || '');
    setFormStatus(p.status || '');
    setFormTechInput('');
    setFormTechnologies(p.technologies || []);
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setIsCreatingNew(false);
  };

  const handleAddTechTag = () => {
    const val = formTechInput.trim();
    if (val && !formTechnologies.includes(val)) {
      setFormTechnologies([...formTechnologies, val]);
      setFormTechInput('');
    }
  };

  const handleRemoveTechTag = (tag: string) => {
    setFormTechnologies(formTechnologies.filter((t) => t !== tag));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      showToast('Title and Description are required.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (isCreatingNew) {
        const created = await DataService.createProject({
          title: formTitle.trim(),
          category: formCategory.trim(),
          description: formDescription.trim(),
          objectives: formObjectives.trim(),
          keyFeatures: formKeyFeatures.trim(),
          technologies: formTechnologies,
          contribution: formContribution.trim(),
          status: formStatus.trim(),
        });
        showToast('Project created successfully!', 'success');
        setIsCreatingNew(false);
        setEditingProject(created);
      } else if (editingProject) {
        await DataService.updateProject(editingProject.id, {
          title: formTitle.trim(),
          category: formCategory.trim(),
          description: formDescription.trim(),
          objectives: formObjectives.trim(),
          keyFeatures: formKeyFeatures.trim(),
          technologies: formTechnologies,
          contribution: formContribution.trim(),
          status: formStatus.trim(),
        });
        showToast('Project updated successfully!', 'success');
      }
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Error saving project.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await DataService.deleteProject(id);
      showToast('Project deleted successfully.', 'info');
      setDeleteConfirmId(null);
      if (editingProject?.id === id) cancelEdit();
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Error deleting project.', 'error');
    }
  };

  // Multiple Image Upload handler
  const handleImageFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProject) return;
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const f of files) {
      const v = validateImageFile(f);
      if (!v.valid) {
        showToast(`${f.name}: ${v.error}`, 'error');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }

    setIsUploadingImages(true);
    try {
      await DataService.uploadProjectImages(editingProject.id, files);
      showToast(`${files.length} photograph(s) uploaded successfully!`, 'success');
      onRefresh();
      // Reload current project to get fresh images
      const updatedList = await DataService.getProjects();
      const fresh = updatedList.find((p) => p.id === editingProject.id);
      if (fresh) setEditingProject(fresh);
    } catch (err: any) {
      showToast(err.message || 'Failed to upload images.', 'error');
    } finally {
      setIsUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetMainImage = async (imgId: string) => {
    if (!editingProject) return;
    try {
      await DataService.setMainProjectImage(editingProject.id, imgId);
      const updatedImages = editingProject.images.map((img) => ({
        ...img,
        isMain: img.id === imgId,
      }));
      setEditingProject({ ...editingProject, images: updatedImages });
      onRefresh();
      showToast('Main photograph updated.', 'success');
    } catch (err: any) {
      showToast('Error setting main photograph.', 'error');
    }
  };

  const handleDeleteImage = async (imgId: string) => {
    if (!editingProject) return;
    if (window.confirm('Delete this photograph from the case study?')) {
      try {
        await DataService.deleteProjectImage(editingProject.id, imgId);
        const updatedImages = editingProject.images.filter((img) => img.id !== imgId);
        setEditingProject({ ...editingProject, images: updatedImages });
        onRefresh();
        showToast('Photograph deleted.', 'info');
      } catch (err: any) {
        showToast('Error deleting photograph.', 'error');
      }
    }
  };

  const handleMoveImage = async (index: number, direction: 'left' | 'right') => {
    if (!editingProject) return;
    const images = [...editingProject.images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    // Swap
    const temp = images[index];
    images[index] = images[targetIndex];
    images[targetIndex] = temp;

    setEditingProject({ ...editingProject, images });
    try {
      await DataService.reorderProjectImages(editingProject.id, images.map((i) => i.id));
      onRefresh();
    } catch (err: any) {
      showToast('Failed to save image reorder.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-nearBlack">
            Project & Case Study Management
          </h2>
          <p className="text-xs text-neutralGray mt-1">
            Add new engineering projects, upload multiple actual photos, and edit case studies.
          </p>
        </div>

        {!editingProject && !isCreatingNew && (
          <button
            onClick={startCreate}
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider bg-nearBlack hover:bg-black text-warmWhite px-4 py-2.5 rounded-sm transition-colors shadow-sm self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        )}
      </div>

      {/* EDIT / CREATE FORM MODAL OR SECTION */}
      {(editingProject || isCreatingNew) ? (
        <div className="bg-white border border-subtleBorder p-6 sm:p-8 rounded-sm space-y-8 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between pb-4 border-b border-subtleBorder">
            <h3 className="text-sm uppercase tracking-wider font-bold text-nearBlack">
              {isCreatingNew ? 'Add New Project' : `Editing: ${editingProject?.title}`}
            </h3>
            <button
              onClick={cancelEdit}
              className="text-xs font-semibold uppercase tracking-wider text-neutralGray hover:text-nearBlack flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>

          <form onSubmit={handleSaveProject} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                  Project Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. BEDGUARD: Bed Exit Alert System"
                  className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Embedded Systems Prototype / Desktop Software Application"
                  className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                  Status
                </label>
                <input
                  type="text"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  placeholder="e.g. Completed Prototype / Academic Project / Demonstration Model"
                  className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                Short Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Clear summary of what the system does..."
                className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                  Project Objectives
                </label>
                <textarea
                  rows={3}
                  value={formObjectives}
                  onChange={(e) => setFormObjectives(e.target.value)}
                  placeholder="Key engineering objectives and goals..."
                  className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                  Key Features & Mechanisms
                </label>
                <textarea
                  rows={3}
                  value={formKeyFeatures}
                  onChange={(e) => setFormKeyFeatures(e.target.value)}
                  placeholder="Sensors, control logic, database modules, etc..."
                  className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                My Engineering Contribution
              </label>
              <input
                type="text"
                value={formContribution}
                onChange={(e) => setFormContribution(e.target.value)}
                placeholder="e.g. Circuit wiring, sensor calibration, state machine code..."
                className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
              />
            </div>

            {/* Technologies Tag Manager */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                Technologies & Tools
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={formTechInput}
                  onChange={(e) => setFormTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTechTag();
                    }
                  }}
                  placeholder="e.g. Arduino, C++, Sensors (Press enter or Add)"
                  className="flex-1 text-xs px-3.5 py-2 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTechTag}
                  className="px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-subtleBorder hover:border-nearBlack rounded-sm"
                >
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                {formTechnologies.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center space-x-1 text-xs bg-warmWhite border border-subtleBorder px-2.5 py-1 rounded-sm"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTechTag(t)}
                      className="text-neutralGray hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-4 border-t border-subtleBorder flex items-center justify-between">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-neutralGray hover:text-nearBlack"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider bg-nearBlack hover:bg-black text-warmWhite px-6 py-2.5 rounded-sm transition-colors disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving Project...' : 'Save Project Details'}</span>
              </button>
            </div>
          </form>

          {/* PROJECT PHOTOGRAPHS & IMAGE GALLERY MANAGEMENT (When Editing) */}
          {editingProject && (
            <div className="pt-8 border-t border-subtleBorder space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-nearBlack">
                    Project Photographs ({editingProject.images.length})
                  </h4>
                  <p className="text-[11px] text-neutralGray mt-0.5">
                    Upload multiple photographs, set the main preview image, and reorder.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleImageFilesSelected}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImages}
                    className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider bg-white border border-subtleBorder hover:border-nearBlack px-4 py-2 rounded-sm transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5 text-neutralGray" />
                    <span>{isUploadingImages ? 'Uploading Photos...' : 'Upload Photos'}</span>
                  </button>
                </div>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {editingProject.images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative border border-subtleBorder rounded-sm bg-warmWhite p-2.5 flex flex-col justify-between space-y-2 group"
                  >
                    <div className="aspect-[4/3] bg-white border border-subtleBorder/70 overflow-hidden rounded-sm flex items-center justify-center">
                      <img
                        src={img.imageUrl}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex items-center space-x-1">
                        {img.isMain ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-mono font-bold bg-nearBlack text-white px-2 py-0.5 rounded-sm">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span>MAIN</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetMainImage(img.id)}
                            className="text-[10px] font-medium text-neutralGray hover:text-nearBlack underline"
                          >
                            Set Main
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        {/* Reorder left/right */}
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, 'left')}
                            className="p-1 hover:bg-neutralGray/10 rounded"
                            title="Move Earlier"
                          >
                            <ArrowLeft className="w-3 h-3 text-neutralGray" />
                          </button>
                        )}
                        {idx < editingProject.images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, 'right')}
                            className="p-1 hover:bg-neutralGray/10 rounded"
                            title="Move Later"
                          >
                            <ArrowRight className="w-3 h-3 text-neutralGray" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="p-1 hover:bg-rose-100 text-rose-600 rounded ml-1"
                          title="Delete Photograph"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {editingProject.images.length === 0 && (
                  <div className="sm:col-span-2 md:col-span-3 p-8 border border-dashed border-subtleBorder rounded-sm text-center">
                    <p className="text-xs text-neutralGray">
                      No photographs uploaded yet for this project.
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 text-xs font-semibold text-accentBlue hover:underline uppercase tracking-wider"
                    >
                      Click here to select and upload photos
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* PROJECTS LIST VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {projects.map((proj, idx) => {
              const mainImg = proj.images.find((i) => i.isMain) || proj.images[0];

              return (
                <div
                  key={proj.id}
                  className="bg-white border border-subtleBorder p-5 sm:p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-neutralGray/40 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-16 sm:w-24 sm:h-20 bg-warmWhite border border-subtleBorder rounded-sm flex-shrink-0 overflow-hidden">
                      <ImageWithFallback
                        src={mainImg?.imageUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                        placeholderType="project"
                      />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 text-xs mb-1">
                        <span className="font-mono text-neutralGray">0{idx + 1}</span>
                        <span className="text-neutralGray">•</span>
                        <span className="text-accentBlue font-semibold uppercase tracking-wider">
                          {proj.category}
                        </span>
                        {proj.status && (
                          <span className="hidden sm:inline-block text-[11px] text-neutralGray">
                            ({proj.status})
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-nearBlack tracking-tight">
                        {proj.title}
                      </h3>

                      <p className="text-xs text-neutralGray line-clamp-2 mt-1 max-w-2xl">
                        {proj.description}
                      </p>

                      <div className="flex items-center space-x-3 text-[11px] text-neutralGray mt-2">
                        <span>{proj.images.length} photograph(s)</span>
                        <span>•</span>
                        <span>{proj.technologies?.length || 0} technology tags</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 self-end md:self-center">
                    <button
                      onClick={() => startEdit(proj)}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider bg-warmWhite hover:bg-white border border-subtleBorder hover:border-nearBlack text-nearBlack px-3.5 py-2 rounded-sm transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-neutralGray" />
                      <span>Edit & Photos</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(proj.id)}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-2 rounded-sm transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {projects.length === 0 && (
              <div className="bg-white border border-subtleBorder p-12 text-center rounded-sm">
                <FolderPlus className="w-10 h-10 text-neutralGray mx-auto mb-3" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-nearBlack mb-1">
                  No Projects Available
                </h3>
                <p className="text-xs text-neutralGray mb-4">
                  Get started by adding your first engineering project case study.
                </p>
                <button
                  onClick={startCreate}
                  className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider bg-nearBlack text-warmWhite px-4 py-2.5 rounded-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-subtleBorder rounded-sm p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-start space-x-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-nearBlack">
                  Confirm Project Deletion
                </h4>
                <p className="text-xs text-neutralGray mt-1 leading-relaxed">
                  Are you sure you want to permanently delete this project? This will remove the case study and its associated photographs from the portfolio.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-subtleBorder">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutralGray hover:text-nearBlack"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProject(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white rounded-sm transition-colors"
              >
                Yes, Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
