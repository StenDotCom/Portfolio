import React, { useState } from 'react';
import { Mail, Github, Facebook, Instagram, Copy, Check, Send, ArrowUpRight } from 'lucide-react';
import { Profile } from '../types';
import { DataService } from '../lib/storage';

interface ContactProps {
  profile: Profile;
}

export const Contact: React.FC<ContactProps> = ({ profile }) => {
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await DataService.submitMessage({
        name: formState.name.trim(),
        email: formState.email.trim(),
        subject: formState.subject.trim() || 'Direct Portfolio Inquiry',
        message: formState.message.trim(),
      });

      setSubmitSuccess(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit message. Please try again or email directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 border-b border-subtleBorder scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-wider font-semibold text-accentBlue mb-2 block">
            05 / Inquiries & Collaboration
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-nearBlack">
            Contact
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Direct Communication Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-sm sm:text-base text-nearBlack/80 leading-relaxed">
              Feel free to reach out for project inquiries, technical collaboration, or academic discussions regarding embedded systems and software engineering.
            </p>

            {/* Email Card with Copy button */}
            <div className="editorial-card p-5 rounded-sm space-y-3">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-neutralGray block">
                Direct Email Address
              </span>
              <div className="flex items-center justify-between gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="text-sm font-semibold text-nearBlack hover:text-accentBlue transition-colors truncate"
                  title="Click to email"
                >
                  {profile.email}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center space-x-1 text-xs px-2.5 py-1.5 rounded border border-subtleBorder hover:border-nearBlack text-neutralGray hover:text-nearBlack transition-colors flex-shrink-0"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600 font-medium text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social / Technical Profiles */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-neutralGray block mb-3">
                Online Profiles & Platforms
              </span>

              <div className="space-y-2">
                {/* GitHub */}
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-card p-3.5 rounded-sm flex items-center justify-between group hover:border-nearBlack transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Github className="w-4 h-4 text-nearBlack" />
                    <span className="text-xs font-semibold text-nearBlack">GitHub</span>
                    <span className="text-[11px] text-neutralGray">@StenDotCom</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutralGray group-hover:text-nearBlack transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                {/* Facebook */}
                <a
                  href={profile.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-card p-3.5 rounded-sm flex items-center justify-between group hover:border-nearBlack transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Facebook className="w-4 h-4 text-nearBlack" />
                    <span className="text-xs font-semibold text-nearBlack">Facebook</span>
                    <span className="text-[11px] text-neutralGray">cruuxxx</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutralGray group-hover:text-nearBlack transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                {/* Instagram */}
                <a
                  href={profile.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-card p-3.5 rounded-sm flex items-center justify-between group hover:border-nearBlack transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Instagram className="w-4 h-4 text-nearBlack" />
                    <span className="text-xs font-semibold text-nearBlack">Instagram</span>
                    <span className="text-[11px] text-neutralGray">sten.com_</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutralGray group-hover:text-nearBlack transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Active Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="editorial-card p-6 sm:p-8 rounded-sm">
              <h3 className="text-sm uppercase tracking-wider font-bold text-nearBlack pb-4 border-b border-subtleBorder mb-6">
                Send a Direct Message
              </h3>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs leading-relaxed flex items-start space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Thank you. Your message has been recorded and delivered to the administrator inbox!
                  </span>
                </div>
              )}

              {submitError && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-sm text-xs">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Maria Santos"
                      className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                    Subject / Topic
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    placeholder="Project Inquiry / Engineering Discussion"
                    className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold uppercase tracking-wider text-neutralGray mb-1.5">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full text-xs px-3.5 py-2.5 bg-warmWhite border border-subtleBorder rounded-sm focus:border-accentBlue focus:outline-none transition-colors resize-y"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-neutralGray">
                    Messages are delivered directly to the Admin Dashboard.
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center space-x-2 bg-nearBlack text-warmWhite hover:bg-black px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Submit Message</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
