import React from 'react';
import { Project, Profile, Skill, ContactMessage } from '../types';
import { 
  FolderKanban, 
  Image as ImageIcon, 
  Cpu, 
  Mail, 
  ArrowRight, 
  User, 
  Database,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface AdminOverviewProps {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  messages: ContactMessage[];
  onSelectTab: (tab: string) => void;
  onViewPublic: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  profile,
  projects,
  skills,
  messages,
  onSelectTab,
  onViewPublic,
}) => {
  const totalImages = projects.reduce((acc, p) => acc + (p.images ? p.images.length : 0), 0);
  const unreadMessages = messages.filter((m) => !m.read).length;

  const stats = [
    {
      title: 'Projects',
      value: projects.length,
      detail: `${totalImages} total photographs`,
      icon: FolderKanban,
      tab: 'projects',
    },
    {
      title: 'Project Images',
      value: totalImages,
      detail: 'Across all project case studies',
      icon: ImageIcon,
      tab: 'projects',
    },
    {
      title: 'Technical Skills',
      value: skills.length,
      detail: 'Categorized competencies',
      icon: Cpu,
      tab: 'skills',
    },
    {
      title: 'Inquiries',
      value: messages.length,
      detail: `${unreadMessages} unread messages`,
      icon: Mail,
      tab: 'contact',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white border border-subtleBorder p-6 sm:p-8 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-accentBlue mb-1.5">
            <span>Portfolio Administrator</span>
            <span>•</span>
            <span>ICCT Colleges</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-nearBlack">
            Welcome, {profile.fullName}
          </h1>
          <p className="text-xs text-neutralGray mt-1">
            Manage your personal portfolio, upload photographs, edit case studies, and update competencies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onViewPublic}
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider bg-white border border-subtleBorder hover:border-nearBlack text-nearBlack px-4 py-2.5 rounded-sm transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onSelectTab('projects')}
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider bg-nearBlack hover:bg-black text-warmWhite px-4 py-2.5 rounded-sm transition-colors"
          >
            <span>Manage Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cloud Backend Status Card */}
      <div className={`p-4 rounded-sm border text-xs flex items-center justify-between ${
        isSupabaseConfigured
          ? 'bg-blue-50/60 border-blue-200 text-blue-900'
          : 'bg-amber-50/70 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center space-x-3">
          {isSupabaseConfigured ? (
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          )}
          <div>
            <span className="font-bold uppercase tracking-wider block">
              {isSupabaseConfigured ? 'Supabase Backend Connected' : 'Local Persistence Engine Active'}
            </span>
            <span className="text-[11px] text-neutralGray">
              {isSupabaseConfigured
                ? 'Your changes and uploaded photographs synchronize directly with Supabase Postgres and Storage.'
                : 'Changes are preserved in browser storage. Connect Supabase in .env to enable multi-device cloud persistence.'}
            </span>
          </div>
        </div>

        <button
          onClick={() => onSelectTab('database')}
          className="text-xs font-semibold uppercase tracking-wider underline hover:opacity-80 flex-shrink-0 ml-4"
        >
          {isSupabaseConfigured ? 'View Database Info' : 'Setup Supabase'}
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              onClick={() => onSelectTab(stat.tab)}
              className="bg-white border border-subtleBorder p-5 rounded-sm hover:border-nearBlack cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between text-neutralGray mb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-neutralGray">
                  {stat.title}
                </span>
                <Icon className="w-4 h-4 text-neutralGray group-hover:text-accentBlue transition-colors" />
              </div>

              <div className="text-3xl font-bold tracking-tight text-nearBlack mb-1">
                {stat.value}
              </div>

              <p className="text-[11px] text-neutralGray">
                {stat.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Action Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Quick Summary */}
        <div className="bg-white border border-subtleBorder p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-subtleBorder">
            <h3 className="text-xs uppercase tracking-wider font-bold text-nearBlack flex items-center space-x-2">
              <User className="w-3.5 h-3.5 text-accentBlue" />
              <span>Identity & Biography</span>
            </h3>
            <button
              onClick={() => onSelectTab('profile')}
              className="text-xs font-semibold text-accentBlue hover:underline uppercase tracking-wider"
            >
              Edit Profile
            </button>
          </div>

          <div className="text-xs space-y-2 text-nearBlack/85">
            <p><span className="text-neutralGray font-medium">Name:</span> {profile.fullName}</p>
            <p><span className="text-neutralGray font-medium">Title:</span> {profile.professionalTitle}</p>
            <p><span className="text-neutralGray font-medium">Institution:</span> {profile.institution}</p>
            <p><span className="text-neutralGray font-medium">Profile Photo:</span> {profile.profileImageUrl ? 'Uploaded' : 'Neutral Placeholder'}</p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectTab('profile')}
              className="w-full py-2 bg-warmWhite border border-subtleBorder hover:border-nearBlack text-xs font-semibold uppercase tracking-wider text-nearBlack rounded-sm transition-colors"
            >
              Upload Profile Photo / Edit Bio
            </button>
          </div>
        </div>

        {/* Database & Deployment Status */}
        <div className="bg-white border border-subtleBorder p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-subtleBorder">
            <h3 className="text-xs uppercase tracking-wider font-bold text-nearBlack flex items-center space-x-2">
              <Database className="w-3.5 h-3.5 text-accentBlue" />
              <span>Storage & Architecture</span>
            </h3>
            <button
              onClick={() => onSelectTab('database')}
              className="text-xs font-semibold text-accentBlue hover:underline uppercase tracking-wider"
            >
              Manage
            </button>
          </div>

          <div className="text-xs space-y-2 text-nearBlack/85">
            <p><span className="text-neutralGray font-medium">Target Stack:</span> React, TypeScript, Tailwind CSS, Supabase</p>
            <p><span className="text-neutralGray font-medium">Storage Bucket:</span> portfolio-images (Public)</p>
            <p><span className="text-neutralGray font-medium">Row Level Security:</span> Enforced on all tables</p>
            <p><span className="text-neutralGray font-medium">Max Image Size:</span> 5 MB per photograph (JPG, PNG, WebP)</p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectTab('database')}
              className="w-full py-2 bg-warmWhite border border-subtleBorder hover:border-nearBlack text-xs font-semibold uppercase tracking-wider text-nearBlack rounded-sm transition-colors"
            >
              Open Database & Supabase Guide
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
