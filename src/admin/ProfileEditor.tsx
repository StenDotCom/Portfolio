import React, { useState, useRef } from 'react';
import { Profile } from '../types';
import { DataService, validateImageFile } from '../lib/storage';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { Upload, Trash2, Save, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface ProfileEditorProps {
  profile: Profile;
  onSave: (updated: Profile) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  profile,
  onSave,
  showToast,
}) => {
  const [formData, setFormData] = useState<Profile>({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file selection for profile photograph
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      showToast(validation.error || 'Invalid file format or size.', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setPendingFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);
    showToast('Photo selected. Click "Upload & Apply Photo" to save.', 'info');
  };

  // Upload and commit profile photo
  const handleUploadPhoto = async () => {
    if (!pendingFile) return;

    setIsUploadingPhoto(true);
    try {
      const newUrl = await DataService.uploadProfileImage(pendingFile);
      const updated = { ...formData, profileImageUrl: newUrl };
      setFormData(updated);
      onSave(updated);
      setPendingFile(null);
      setPhotoPreview(null);
      showToast('Profile photograph uploaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload photograph.', 'error');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Remove profile photo
  const handleRemovePhoto = async () => {
    if (window.confirm('Are you sure you want to remove your profile photo? It will revert to the neutral placeholder.')) {
      try {
        await DataService.removeProfileImage();
        const updated = { ...formData, profileImageUrl: null };
        setFormData(updated);
        setPhotoPreview(null);
        setPendingFile(null);
        onSave(updated);
        showToast('Profile photo removed.', 'info');
      } catch (err: any) {
        showToast('Failed to remove photo.', 'error');
      }
    }
  };

  // Save all profile metadata
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updated = await DataService.updateProfile(formData);
      onSave(updated);
      showToast('Profile information saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error saving profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-nearBlack">
          Profile & Biography Management
        </h2>
        <p className="text-xs text-neutralGray mt-1">
          Update your public biography, academic title, and profile photograph.
        </p>
      </div>

      {/* 1. Profile Photograph Upload Card */}
      <div className="bg-white border border-subtleBorder p-6 sm:p-8 rounded-sm">
        <h3 className="text-xs uppercase tracking-wider font-bold text-nearBlack pb-4 border-b border-subtleBorder mb-6">
          Profile Photograph
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Photo Frame / Preview */}
          <div className="md:col-span-4 flex flex-col items-center">
            <div className="relative w-48 aspect-[4/5] bg-[#F4F4F0] border border-subtleBorder rounded-sm overflow-hidden flex items-center justify-center shadow-sm">
              <ImageWithFallback
                src={photoPreview || formData.profileImageUrl}
                alt={`Profile photo of ${formData.fullName}`}
                className="w-full h-full object-cover object-top"
                placeholderType="portrait"
                fallbackText={formData.fullName}
              />

              {photoPreview && (
                <div className="absolute top-2 right-2 bg-accentBlue text-white text-[10px] font-mono px-2 py-0.5 rounded shadow">
                  Preview
                </div>
              )}
            </div>

            <span className="text-[11px] text-neutralGray mt-3 text-center">
              Aspect Ratio 4:5 • Max 5MB • JPG, PNG, WebP
            </span>
          </div>

          {/* Upload Controls & Instructions */}
          <div className="md:col-span-8 space-y-4">
            <div className="p-4 bg-warmWhite border border-subtleBorder rounded-sm text-xs space-y-2 text-nearBlack/80">
              <p className="font-semibold text-nearBlack">
                Requirement Guidelines:
              </p>
              <ul className="list-disc list-inside space-y-1 text-neutralGray text-[11px]">
                <li>Use an authentic personal photograph (never AI-generated avatars).</li>
                <li>Preview appears immediately before uploading.</li>
                <li>Saved directly to persistent cloud storage (Supabase / local fallback).</li>
              </ul>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider bg-white border border-subtleBorder hover:border-nearBlack text-nearBlack px-4 py-2.5 rounded-sm transition-colors"
              >
                <Upload className="w-4 h-4 text-neutralGray" />
                <span>{formData.profileImageUrl ? 'Select New Photo' : 'Choose Photo File'}</span>
              </button>

              {pendingFile && (
                <button
                  type="button"
                  onClick={handleUploadPhoto}
                  disabled={isUploadingPhoto}
                  className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider bg-accentBlue hover:bg-accentBlueHover text-white px-5 py-2.5 rounded-sm transition-colors shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isUploadingPhoto ? 'animate-spin' : ''}`} />
                  <span>{isUploadingPhoto ? 'Uploading...' : 'Upload & Apply Photo'}</span>
                </button>
              )}

              {formData.profileImageUrl && !pendingFile && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-rose-700 hover:text-rose-900 border border-rose-200 hover:border-rose-400 bg-rose-50 px-3.5 py-2.5 rounded-sm transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Photo</span>
                </button>
              )}
            </div>

            {pendingFile && (
              <p className="text-[11px] text-accentBlue font-medium">
                Selected: {pendingFile.name} ({(pendingFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}
          </div>

        </div>
      </div>

      {/* 2. Identity, Bio, & Text Fields Form */}
      <form onSubmit={handleFormSubmit} className="bg-white border border-subtleBorder p-6 sm:p-8 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-wider font-bold text-nearBlack pb-4 border-b border-subtleBorder mb-6">
          Personal Information & Biography
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
              Professional Title
            </label>
            <input
              type="text"
              required
              value={formData.professionalTitle}
              onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
              Institution
            </label>
            <input
              type="text"
              required
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
              Year Level
            </label>
            <input
              type="text"
              required
              value={formData.yearLevel}
              onChange={(e) => setFormData({ ...formData, yearLevel: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
              Location
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
              Primary Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
            />
          </div>
        </div>

        {/* Hero Intro */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
            Hero Introductory Text
          </label>
          <textarea
            rows={2}
            required
            value={formData.heroIntro}
            onChange={(e) => setFormData({ ...formData, heroIntro: e.target.value })}
            className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
          />
        </div>

        {/* Full Biography */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
            Full Biography
          </label>
          <textarea
            rows={5}
            required
            value={formData.biography}
            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
            className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none leading-relaxed"
          />
        </div>

        {/* Form Submit */}
        <div className="pt-4 border-t border-subtleBorder flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider bg-nearBlack hover:bg-black text-warmWhite px-6 py-2.5 rounded-sm transition-colors disabled:opacity-50 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
