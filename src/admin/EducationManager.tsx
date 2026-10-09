import React, { useState } from 'react';
import { Education } from '../types';
import { DataService } from '../lib/storage';
import { Save, School, GraduationCap } from 'lucide-react';

interface EducationManagerProps {
  education: Education[];
  onRefresh: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const EducationManager: React.FC<EducationManagerProps> = ({
  education,
  onRefresh,
  showToast,
}) => {
  const current = education[0] || {
    id: 'edu-icct-bscpe',
    institution: 'ICCT Colleges',
    program: 'Computer Engineering',
    yearLevel: 'Fourth Year',
    details: 'Bachelor of Science in Computer Engineering',
  };

  const [formData, setFormData] = useState<Education>({ ...current });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await DataService.updateEducation(formData);
      showToast('Education details updated successfully!', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Error updating education.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-nearBlack">
          Education & Degree Information
        </h2>
        <p className="text-xs text-neutralGray mt-1">
          Manage your verified college program and academic standing at ICCT Colleges.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-subtleBorder p-6 sm:p-8 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-wider font-bold text-nearBlack pb-3 border-b border-subtleBorder mb-5 flex items-center space-x-2">
          <GraduationCap className="w-4 h-4 text-accentBlue" />
          <span>Academic Profile</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
              Institution Name
            </label>
            <input
              type="text"
              required
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                Degree Program
              </label>
              <input
                type="text"
                required
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                Current Year Level
              </label>
              <input
                type="text"
                required
                value={formData.yearLevel}
                onChange={(e) => setFormData({ ...formData, yearLevel: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
              Academic Focus & Laboratory Details
            </label>
            <textarea
              rows={4}
              value={formData.details || ''}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="e.g. Focus on embedded microcontrollers, electronics, hardware prototyping..."
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-subtleBorder flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider bg-nearBlack hover:bg-black text-warmWhite px-6 py-2.5 rounded-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Education Details'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
