import React, { useState, useEffect, useCallback } from 'react';
import { Profile, Project, Skill, Education, ContactMessage, AuthUser } from './types';
import { DataService } from './lib/storage';
import { AuthService } from './lib/auth';

// Public Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Education as EducationSection } from './components/Education';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

// Admin Components
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminOverview } from './admin/AdminOverview';
import { ProfileEditor } from './admin/ProfileEditor';
import { ProjectsManager } from './admin/ProjectsManager';
import { SkillsManager } from './admin/SkillsManager';
import { EducationManager } from './admin/EducationManager';
import { ContactManager } from './admin/ContactManager';
import { SupabaseSettings } from './admin/SupabaseSettings';
import { Toast, ToastMessage } from './admin/Toast';

export function App() {
  // Navigation / View State
  const [isAdminView, setIsAdminView] = useState(() => {
    return (
      window.location.hash.startsWith('#admin') ||
      window.location.pathname.startsWith('/admin') ||
      new URLSearchParams(window.location.search).get('view') === 'admin'
    );
  });
  const [adminTab, setAdminTab] = useState('overview');

  // Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Portfolio Data State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial portfolio data
  const loadData = useCallback(async () => {
    try {
      const [profData, projData, skillsData, eduData, msgData] = await Promise.all([
        DataService.getProfile(),
        DataService.getProjects(),
        DataService.getSkills(),
        DataService.getEducation(),
        DataService.getMessages(),
      ]);

      setProfile(profData);
      setProjects(projData);
      setSkills(skillsData);
      setEducation(eduData);
      setMessages(msgData);
    } catch (err) {
      console.error('Error loading portfolio data:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Handle URL hash / path routing changes
  useEffect(() => {
    const handleLocationChange = () => {
      const adminRequested =
        window.location.hash.startsWith('#admin') ||
        window.location.pathname.startsWith('/admin') ||
        new URLSearchParams(window.location.search).get('view') === 'admin';
      setIsAdminView(adminRequested);
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Check auth session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuth();
    loadData();

    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, [loadData]);

  // Navigate to admin
  const navigateToAdmin = () => {
    window.location.hash = '#admin';
    setIsAdminView(true);
  };

  // Navigate to public site
  const navigateToPublic = () => {
    window.location.hash = '';
    setIsAdminView(false);
  };

  // Logout
  const handleLogout = async () => {
    await AuthService.logout();
    setCurrentUser(null);
    showToast('Signed out of admin dashboard.', 'info');
  };

  // Loading Screen
  if (isLoadingData || isAuthLoading || !profile) {
    return (
      <div className="min-h-screen bg-warmWhite flex items-center justify-center p-6 text-nearBlack">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-nearBlack border-t-accentBlue rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-wider font-semibold text-neutralGray">
            Loading Portfolio...
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // ADMIN DASHBOARD VIEW
  // ==========================================
  if (isAdminView) {
    if (!currentUser) {
      return (
        <>
          <AdminLogin
            onSuccess={(user) => {
              setCurrentUser(user);
              showToast(`Signed in as ${user.email}`, 'success');
            }}
            onBackToPublic={navigateToPublic}
          />
          <Toast toasts={toasts} onDismiss={dismissToast} />
        </>
      );
    }

    return (
      <>
        <AdminLayout
          user={currentUser}
          activeTab={adminTab}
          onTabChange={setAdminTab}
          onLogout={handleLogout}
          onViewPublic={navigateToPublic}
          unreadCount={messages.filter((m) => !m.read).length}
        >
          {adminTab === 'overview' && (
            <AdminOverview
              profile={profile}
              projects={projects}
              skills={skills}
              messages={messages}
              onSelectTab={setAdminTab}
              onViewPublic={navigateToPublic}
            />
          )}

          {adminTab === 'profile' && (
            <ProfileEditor
              profile={profile}
              onSave={(updated) => {
                setProfile(updated);
                showToast('Profile updated!', 'success');
              }}
              showToast={showToast}
            />
          )}

          {adminTab === 'projects' && (
            <ProjectsManager
              projects={projects}
              onRefresh={loadData}
              showToast={showToast}
            />
          )}

          {adminTab === 'skills' && (
            <SkillsManager
              skills={skills}
              onRefresh={loadData}
              showToast={showToast}
            />
          )}

          {adminTab === 'education' && (
            <EducationManager
              education={education}
              onRefresh={loadData}
              showToast={showToast}
            />
          )}

          {adminTab === 'contact' && (
            <ContactManager
              profile={profile}
              messages={messages}
              onRefresh={loadData}
              showToast={showToast}
            />
          )}

          {adminTab === 'database' && (
            <SupabaseSettings
              onRefreshAll={loadData}
              showToast={showToast}
            />
          )}
        </AdminLayout>

        <Toast toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  // ==========================================
  // PUBLIC PORTFOLIO VIEW
  // ==========================================
  return (
    <div className="min-h-screen bg-warmWhite text-nearBlack selection:bg-accentBlue selection:text-white">
      {/* Navigation */}
      <Navbar onNavigateToAdmin={navigateToAdmin} />

      <main>
        {/* Hero Section */}
        <Hero profile={profile} />

        {/* 01. About Me */}
        <About profile={profile} />

        {/* 02. Selected Projects Gallery */}
        <Projects projects={projects} />

        {/* 03. Technical Skills */}
        <Skills skills={skills} />

        {/* 04. Education */}
        <EducationSection education={education} />

        {/* 05. Contact Section & Message Form */}
        <Contact profile={profile} />
      </main>

      {/* Editorial Footer */}
      <Footer onNavigateToAdmin={navigateToAdmin} />

      {/* Global Toast */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
