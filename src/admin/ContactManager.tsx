import React, { useState } from 'react';
import { Profile, ContactMessage } from '../types';
import { DataService } from '../lib/storage';
import { Save, Mail, Github, Facebook, Instagram, Trash2, CheckCircle, Clock } from 'lucide-react';

interface ContactManagerProps {
  profile: Profile;
  messages: ContactMessage[];
  onRefresh: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const ContactManager: React.FC<ContactManagerProps> = ({
  profile,
  messages,
  onRefresh,
  showToast,
}) => {
  const [formData, setFormData] = useState({
    email: profile.email,
    githubUrl: profile.githubUrl,
    facebookUrl: profile.facebookUrl,
    instagramUrl: profile.instagramUrl,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await DataService.updateProfile(formData);
      showToast('Contact channels updated successfully!', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Error updating contact channels.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await DataService.markMessageRead(id);
      onRefresh();
    } catch (err: any) {
      showToast('Error marking message read.', 'error');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm('Delete this message from your inbox?')) {
      try {
        await DataService.deleteMessage(id);
        showToast('Message deleted.', 'info');
        onRefresh();
      } catch (err: any) {
        showToast('Error deleting message.', 'error');
      }
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-nearBlack">
          Contact Channels & Messages Inbox
        </h2>
        <p className="text-xs text-neutralGray mt-1">
          Manage your email and social profile links, and review messages submitted through your portfolio.
        </p>
      </div>

      {/* 1. Contact Info Form */}
      <form onSubmit={handleSaveContact} className="bg-white border border-subtleBorder p-6 sm:p-8 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-wider font-bold text-nearBlack pb-3 border-b border-subtleBorder mb-5 flex items-center space-x-2">
          <Mail className="w-4 h-4 text-accentBlue" />
          <span>Public Contact Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-neutralGray" />
              <span>Contact Email</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5 flex items-center space-x-1.5">
              <Github className="w-3.5 h-3.5 text-neutralGray" />
              <span>GitHub URL</span>
            </label>
            <input
              type="url"
              required
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5 flex items-center space-x-1.5">
              <Facebook className="w-3.5 h-3.5 text-neutralGray" />
              <span>Facebook URL</span>
            </label>
            <input
              type="url"
              required
              value={formData.facebookUrl}
              onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5 flex items-center space-x-1.5">
              <Instagram className="w-3.5 h-3.5 text-neutralGray" />
              <span>Instagram URL</span>
            </label>
            <input
              type="url"
              required
              value={formData.instagramUrl}
              onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none"
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
            <span>{isSaving ? 'Saving...' : 'Save Contact Channels'}</span>
          </button>
        </div>
      </form>

      {/* 2. Messages Inbox */}
      <div className="bg-white border border-subtleBorder p-6 sm:p-8 rounded-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-subtleBorder mb-5">
          <h3 className="text-xs uppercase tracking-wider font-bold text-nearBlack flex items-center space-x-2">
            <Mail className="w-4 h-4 text-accentBlue" />
            <span>Visitor Inquiries Inbox ({messages.length})</span>
          </h3>
          <span className="text-xs text-neutralGray">
            {messages.filter((m) => !m.read).length} unread
          </span>
        </div>

        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 sm:p-5 rounded-sm border transition-colors ${
                msg.read
                  ? 'bg-warmWhite border-subtleBorder text-nearBlack/80'
                  : 'bg-white border-accentBlue/40 text-nearBlack shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-subtleBorder/60 gap-2 mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-accentBlue"></span>
                    )}
                    <h4 className="text-xs font-bold text-nearBlack">
                      {msg.name}
                    </h4>
                    <span className="text-xs text-neutralGray">
                      &lt;{msg.email}&gt;
                    </span>
                  </div>
                  {msg.subject && (
                    <p className="text-xs font-medium text-accentBlue mt-0.5">
                      Subject: {msg.subject}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-xs text-neutralGray">
                  <span className="flex items-center space-x-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </span>

                  <div className="flex items-center space-x-1">
                    {!msg.read && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="p-1 hover:bg-neutralGray/10 rounded text-accentBlue"
                        title="Mark as Read"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-1 hover:bg-rose-100 rounded text-rose-600"
                      title="Delete Message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-nearBlack/85 leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </p>

              <div className="mt-3 pt-2 flex justify-start">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                  className="text-[11px] font-semibold uppercase tracking-wider text-accentBlue hover:underline inline-flex items-center space-x-1"
                >
                  <Mail className="w-3 h-3" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="text-center py-8 text-xs text-neutralGray">
              No visitor messages received yet. Messages sent via the portfolio contact form will appear here.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
