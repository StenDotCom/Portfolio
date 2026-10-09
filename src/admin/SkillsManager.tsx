import React, { useState } from 'react';
import { Skill } from '../types';
import { DataService } from '../lib/storage';
import { Plus, Trash2, Edit2, Check, X, Cpu, Tag } from 'lucide-react';

interface SkillsManagerProps {
  skills: Skill[];
  onRefresh: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const DEFAULT_CATEGORIES = [
  'Programming and Web',
  'Hardware and Engineering',
  'Design and Productivity',
  'Development Platform',
];

export const SkillsManager: React.FC<SkillsManagerProps> = ({
  skills,
  onRefresh,
  showToast,
}) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const category = selectedCategory === 'CUSTOM' ? customCategory.trim() : selectedCategory;
    if (!category) {
      showToast('Please specify a category.', 'error');
      return;
    }

    try {
      await DataService.addSkill(newSkillName.trim(), category);
      setNewSkillName('');
      if (selectedCategory === 'CUSTOM') setCustomCategory('');
      showToast(`Added skill: ${newSkillName.trim()}`, 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Error adding skill.', 'error');
    }
  };

  const handleStartEdit = (skill: Skill) => {
    setEditingSkillId(skill.id);
    setEditName(skill.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await DataService.updateSkill(id, { name: editName.trim() });
      setEditingSkillId(null);
      showToast('Skill updated.', 'success');
      onRefresh();
    } catch (err: any) {
      showToast('Error updating skill.', 'error');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await DataService.deleteSkill(id);
      showToast('Skill removed.', 'info');
      onRefresh();
    } catch (err: any) {
      showToast('Error deleting skill.', 'error');
    }
  };

  // Group current skills
  const categoriesInUse = Array.from(new Set([...DEFAULT_CATEGORIES, ...skills.map((s) => s.category)]));

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-nearBlack">
          Technical Skills Management
        </h2>
        <p className="text-xs text-neutralGray mt-1">
          Add, edit, and organize competencies across engineering and software categories.
        </p>
      </div>

      {/* Add New Skill Form */}
      <div className="bg-white border border-subtleBorder p-6 sm:p-7 rounded-sm">
        <h3 className="text-xs uppercase tracking-wider font-bold text-nearBlack pb-3 border-b border-subtleBorder mb-5 flex items-center space-x-2">
          <Plus className="w-4 h-4 text-accentBlue" />
          <span>Add New Technical Skill</span>
        </h3>

        <form onSubmit={handleAddSkill} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
              Skill Name
            </label>
            <input
              type="text"
              required
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. Embedded C, FreeRTOS, Proteus..."
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
            >
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="CUSTOM">+ New Category...</option>
            </select>
          </div>

          {selectedCategory === 'CUSTOM' && (
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                New Category Name
              </label>
              <input
                type="text"
                required
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Networking"
                className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
              />
            </div>
          )}

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-nearBlack hover:bg-black text-warmWhite text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>
        </form>
      </div>

      {/* Skills by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoriesInUse.map((cat) => {
          const categorySkills = skills.filter((s) => s.category === cat);

          return (
            <div
              key={cat}
              className="bg-white border border-subtleBorder p-6 rounded-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-subtleBorder mb-4">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-nearBlack flex items-center space-x-2">
                    <Tag className="w-3.5 h-3.5 text-accentBlue" />
                    <span>{cat}</span>
                  </h4>
                  <span className="text-[11px] font-mono text-neutralGray">
                    {categorySkills.length} item(s)
                  </span>
                </div>

                <div className="space-y-2">
                  {categorySkills.map((skill) => {
                    const isEditing = editingSkillId === skill.id;

                    return (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between p-2.5 bg-warmWhite border border-subtleBorder/70 rounded-sm text-xs"
                      >
                        {isEditing ? (
                          <div className="flex items-center space-x-2 flex-1 mr-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full text-xs px-2 py-1 bg-white border border-accentBlue rounded-sm focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(skill.id)}
                              className="p-1 hover:bg-emerald-100 text-emerald-700 rounded"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingSkillId(null)}
                              className="p-1 hover:bg-neutralGray/10 text-neutralGray rounded"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="font-medium text-nearBlack">
                              {skill.name}
                            </span>
                            <div className="flex items-center space-x-1">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(skill)}
                                className="p-1 hover:bg-white text-neutralGray hover:text-nearBlack rounded"
                                title="Edit"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSkill(skill.id)}
                                className="p-1 hover:bg-rose-100 text-rose-600 rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}

                  {categorySkills.length === 0 && (
                    <p className="text-xs text-neutralGray italic py-2">
                      No skills added in this category yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
