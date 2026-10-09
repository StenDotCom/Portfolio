import { Profile, Project, ProjectImage, Skill, Education, ContactMessage } from '../types';
import { initialProfile, initialProjects, initialSkills, initialEducation } from './defaultData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  PROFILE: 'sten_portfolio_profile_v1',
  PROJECTS: 'sten_portfolio_projects_v1',
  SKILLS: 'sten_portfolio_skills_v1',
  EDUCATION: 'sten_portfolio_education_v1',
  MESSAGES: 'sten_portfolio_messages_v1',
  AUTH_SESSION: 'sten_admin_session_v1',
};

// Maximum image size: 5MB
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please upload JPG, PNG, or WebP images.`,
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size is ${sizeMb} MB. Maximum allowed image size is 5 MB.`,
    };
  }
  return { valid: true };
}

// Convert File to Base64 Data URL for local fallback storage
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// --- LOCAL STORAGE HELPERS ---
function getLocalProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local profile', e);
  }
  setLocalProfile(initialProfile);
  return initialProfile;
}

function setLocalProfile(profile: Profile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving local profile', e);
  }
}

function getLocalProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local projects', e);
  }
  setLocalProjects(initialProjects);
  return initialProjects;
}

function setLocalProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving local projects', e);
  }
}

function getLocalSkills(): Skill[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SKILLS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local skills', e);
  }
  setLocalSkills(initialSkills);
  return initialSkills;
}

function setLocalSkills(skills: Skill[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  } catch (e) {
    console.error('Error saving local skills', e);
  }
}

function getLocalEducation(): Education[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EDUCATION);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local education', e);
  }
  setLocalEducation(initialEducation);
  return initialEducation;
}

function setLocalEducation(education: Education[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(education));
  } catch (e) {
    console.error('Error saving local education', e);
  }
}

function getLocalMessages(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local messages', e);
  }
  return [];
}

function setLocalMessages(messages: ContactMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving local messages', e);
  }
}

// --- HYBRID DATA ACCESS LAYER ---

export const DataService = {
  // 1. PROFILE
  async getProfile(): Promise<Profile> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('profile').select('*').limit(1).single();
        if (data && !error) {
          return {
            id: data.id,
            fullName: data.full_name,
            professionalTitle: data.professional_title,
            institution: data.institution,
            yearLevel: data.year_level,
            location: data.location,
            email: data.email,
            githubUrl: data.github_url,
            facebookUrl: data.facebook_url,
            instagramUrl: data.instagram_url,
            biography: data.biography,
            heroIntro: data.hero_intro,
            profileImageUrl: data.profile_image_url,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.warn('Falling back to local profile storage:', err);
      }
    }
    return getLocalProfile();
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const current = await this.getProfile();
    const updated: Profile = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setLocalProfile(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('profile').upsert({
          id: updated.id || 'cruz-profile-primary',
          full_name: updated.fullName,
          professional_title: updated.professionalTitle,
          institution: updated.institution,
          year_level: updated.yearLevel,
          location: updated.location,
          email: updated.email,
          github_url: updated.githubUrl,
          facebook_url: updated.facebookUrl,
          instagram_url: updated.instagramUrl,
          biography: updated.biography,
          hero_intro: updated.heroIntro,
          profile_image_url: updated.profileImageUrl,
          updated_at: updated.updatedAt,
        });
        if (error) throw error;
      } catch (err) {
        console.error('Supabase profile update failed, saved locally:', err);
      }
    }

    return updated;
  },

  async uploadProfileImage(file: File): Promise<string> {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    let imageUrl = '';

    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `profile/avatar_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      } catch (err) {
        console.warn('Supabase storage upload failed, falling back to local storage:', err);
      }
    }

    // Fallback: convert file to Base64
    if (!imageUrl) {
      imageUrl = await fileToDataUrl(file);
    }

    await this.updateProfile({ profileImageUrl: imageUrl });
    return imageUrl;
  },

  async removeProfileImage(): Promise<void> {
    await this.updateProfile({ profileImageUrl: null });
  },

  // 2. PROJECTS
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: projectsData, error: projErr } = await supabase
          .from('projects')
          .select(`
            id,
            title,
            category,
            description,
            objectives,
            key_features,
            technologies,
            contribution,
            status,
            order_index,
            created_at,
            updated_at,
            project_images (
              id,
              project_id,
              image_url,
              caption,
              is_main,
              order_index,
              created_at
            )
          `)
          .order('order_index', { ascending: true });

        if (projectsData && !projErr) {
          return projectsData.map((p: any) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            description: p.description,
            objectives: p.objectives,
            keyFeatures: p.key_features,
            technologies: p.technologies || [],
            contribution: p.contribution,
            status: p.status,
            orderIndex: p.order_index,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
            images: (p.project_images || [])
              .sort((a: any, b: any) => a.order_index - b.order_index)
              .map((img: any) => ({
                id: img.id,
                projectId: img.project_id,
                imageUrl: img.image_url,
                caption: img.caption,
                isMain: img.is_main,
                orderIndex: img.order_index,
                createdAt: img.created_at,
              })),
          }));
        }
      } catch (err) {
        console.warn('Falling back to local project storage:', err);
      }
    }
    return getLocalProjects();
  },

  async createProject(input: Partial<Project>): Promise<Project> {
    const projects = getLocalProjects();
    const newId = 'proj-' + Date.now();
    const newProject: Project = {
      id: newId,
      title: input.title || 'Untitled Project',
      category: input.category || 'Engineering Prototype',
      description: input.description || '',
      objectives: input.objectives || '',
      keyFeatures: input.keyFeatures || '',
      technologies: input.technologies || [],
      contribution: input.contribution || '',
      status: input.status || 'Prototype',
      orderIndex: projects.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: input.images || [],
    };

    projects.push(newProject);
    setLocalProjects(projects);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('projects').insert({
          id: newProject.id,
          title: newProject.title,
          category: newProject.category,
          description: newProject.description,
          objectives: newProject.objectives,
          key_features: newProject.keyFeatures,
          technologies: newProject.technologies,
          contribution: newProject.contribution,
          status: newProject.status,
          order_index: newProject.orderIndex,
          created_at: newProject.createdAt,
          updated_at: newProject.updatedAt,
        });
      } catch (err) {
        console.error('Failed to sync new project to Supabase:', err);
      }
    }

    return newProject;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const projects = getLocalProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');

    const updated: Project = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    projects[index] = updated;
    setLocalProjects(projects);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('projects')
          .update({
            title: updated.title,
            category: updated.category,
            description: updated.description,
            objectives: updated.objectives,
            key_features: updated.keyFeatures,
            technologies: updated.technologies,
            contribution: updated.contribution,
            status: updated.status,
            order_index: updated.orderIndex,
            updated_at: updated.updatedAt,
          })
          .eq('id', id);
      } catch (err) {
        console.error('Failed to sync updated project to Supabase:', err);
      }
    }

    return updated;
  },

  async deleteProject(id: string): Promise<void> {
    const projects = getLocalProjects().filter((p) => p.id !== id);
    setLocalProjects(projects);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (err) {
        console.error('Failed to delete project on Supabase:', err);
      }
    }
  },

  async uploadProjectImages(projectId: string, files: File[]): Promise<ProjectImage[]> {
    for (const file of files) {
      const v = validateImageFile(file);
      if (!v.valid) throw new Error(v.error);
    }

    const projects = getLocalProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('Project not found');

    const newImages: ProjectImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let imageUrl = '';

      if (isSupabaseConfigured && supabase) {
        try {
          const fileExt = file.name.split('.').pop() || 'jpg';
          const fileName = `projects/${projectId}/${Date.now()}_${i}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('portfolio-images')
            .upload(fileName, file, { cacheControl: '3600', upsert: true });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('portfolio-images')
              .getPublicUrl(fileName);
            imageUrl = publicUrlData.publicUrl;
          }
        } catch (err) {
          console.warn('Supabase image upload failed, falling back to data URL:', err);
        }
      }

      if (!imageUrl) {
        imageUrl = await fileToDataUrl(file);
      }

      const isMain = project.images.length === 0 && i === 0;
      const newImg: ProjectImage = {
        id: 'img-' + Date.now() + '-' + i,
        projectId,
        imageUrl,
        isMain,
        orderIndex: project.images.length + i + 1,
        createdAt: new Date().toISOString(),
      };

      newImages.push(newImg);

      if (isSupabaseConfigured && supabase && !imageUrl.startsWith('data:')) {
        try {
          await supabase.from('project_images').insert({
            id: newImg.id,
            project_id: newImg.projectId,
            image_url: newImg.imageUrl,
            is_main: newImg.isMain,
            order_index: newImg.orderIndex,
            created_at: newImg.createdAt,
          });
        } catch (err) {
          console.error('Failed to save project image record in Supabase:', err);
        }
      }
    }

    project.images = [...project.images, ...newImages];
    setLocalProjects(projects);

    return newImages;
  },

  async deleteProjectImage(projectId: string, imageId: string): Promise<void> {
    const projects = getLocalProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    project.images = project.images.filter((img) => img.id !== imageId);
    // If the main image was deleted, make the first remaining image main
    if (project.images.length > 0 && !project.images.some((img) => img.isMain)) {
      project.images[0].isMain = true;
    }

    setLocalProjects(projects);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('project_images').delete().eq('id', imageId);
      } catch (err) {
        console.error('Failed to delete image record on Supabase:', err);
      }
    }
  },

  async setMainProjectImage(projectId: string, imageId: string): Promise<void> {
    const projects = getLocalProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    project.images.forEach((img) => {
      img.isMain = img.id === imageId;
    });

    setLocalProjects(projects);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('project_images').update({ is_main: false }).eq('project_id', projectId);
        await supabase.from('project_images').update({ is_main: true }).eq('id', imageId);
      } catch (err) {
        console.error('Failed to update main image on Supabase:', err);
      }
    }
  },

  async reorderProjectImages(projectId: string, imageIds: string[]): Promise<void> {
    const projects = getLocalProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const ordered: ProjectImage[] = [];
    imageIds.forEach((id, idx) => {
      const match = project.images.find((img) => img.id === id);
      if (match) {
        match.orderIndex = idx + 1;
        ordered.push(match);
      }
    });

    project.images = ordered;
    setLocalProjects(projects);

    if (isSupabaseConfigured && supabase) {
      try {
        for (const img of ordered) {
          await supabase.from('project_images').update({ order_index: img.orderIndex }).eq('id', img.id);
        }
      } catch (err) {
        console.error('Failed to sync reordered images to Supabase:', err);
      }
    }
  },

  // 3. SKILLS
  async getSkills(): Promise<Skill[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('order_index', { ascending: true });
        if (data && !error) {
          return data.map((s: any) => ({
            id: s.id,
            name: s.name,
            category: s.category,
            orderIndex: s.order_index,
          }));
        }
      } catch (err) {
        console.warn('Falling back to local skills:', err);
      }
    }
    return getLocalSkills();
  },

  async addSkill(name: string, category: string): Promise<Skill> {
    const skills = getLocalSkills();
    const newSkill: Skill = {
      id: 'skill-' + Date.now(),
      name,
      category,
      orderIndex: skills.length + 1,
    };
    skills.push(newSkill);
    setLocalSkills(skills);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('skills').insert({
          id: newSkill.id,
          name: newSkill.name,
          category: newSkill.category,
          order_index: newSkill.orderIndex,
        });
      } catch (err) {
        console.error('Supabase add skill error:', err);
      }
    }

    return newSkill;
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    const skills = getLocalSkills();
    const idx = skills.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Skill not found');

    const updated = { ...skills[idx], ...updates };
    skills[idx] = updated;
    setLocalSkills(skills);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('skills')
          .update({
            name: updated.name,
            category: updated.category,
            order_index: updated.orderIndex,
          })
          .eq('id', id);
      } catch (err) {
        console.error('Supabase update skill error:', err);
      }
    }

    return updated;
  },

  async deleteSkill(id: string): Promise<void> {
    const skills = getLocalSkills().filter((s) => s.id !== id);
    setLocalSkills(skills);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('skills').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase delete skill error:', err);
      }
    }
  },

  // 4. EDUCATION
  async getEducation(): Promise<Education[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('education').select('*').limit(1);
        if (data && data.length > 0 && !error) {
          return data.map((e: any) => ({
            id: e.id,
            institution: e.institution,
            program: e.program,
            yearLevel: e.year_level,
            details: e.details,
          }));
        }
      } catch (err) {
        console.warn('Falling back to local education:', err);
      }
    }
    return getLocalEducation();
  },

  async updateEducation(edu: Education): Promise<Education> {
    const list = [edu];
    setLocalEducation(list);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('education').upsert({
          id: edu.id || 'edu-icct-bscpe',
          institution: edu.institution,
          program: edu.program,
          year_level: edu.yearLevel,
          details: edu.details,
        });
      } catch (err) {
        console.error('Supabase update education error:', err);
      }
    }

    return edu;
  },

  // 5. CONTACT MESSAGES
  async submitMessage(input: { name: string; email: string; subject?: string; message: string }): Promise<ContactMessage> {
    const msg: ContactMessage = {
      id: 'msg-' + Date.now(),
      name: input.name,
      email: input.email,
      subject: input.subject || 'Portfolio Inquiry',
      message: input.message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    const messages = getLocalMessages();
    messages.unshift(msg);
    setLocalMessages(messages);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('messages').insert({
          id: msg.id,
          name: msg.name,
          email: msg.email,
          subject: msg.subject,
          message: msg.message,
          created_at: msg.createdAt,
          read_status: false,
        });
      } catch (err) {
        console.error('Supabase submit message error:', err);
      }
    }

    return msg;
  },

  async getMessages(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (data && !error) {
          return data.map((m: any) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            subject: m.subject,
            message: m.message,
            createdAt: m.created_at,
            read: m.read_status ?? false,
          }));
        }
      } catch (err) {
        console.warn('Falling back to local messages:', err);
      }
    }
    return getLocalMessages();
  },

  async markMessageRead(id: string): Promise<void> {
    const messages = getLocalMessages();
    const match = messages.find((m) => m.id === id);
    if (match) {
      match.read = true;
      setLocalMessages(messages);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('messages').update({ read_status: true }).eq('id', id);
      } catch (err) {
        console.error('Supabase mark read error:', err);
      }
    }
  },

  async deleteMessage(id: string): Promise<void> {
    const messages = getLocalMessages().filter((m) => m.id !== id);
    setLocalMessages(messages);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('messages').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase delete message error:', err);
      }
    }
  },

  // 6. SYNC LOCAL DATA TO SUPABASE
  async syncLocalToSupabase(): Promise<{ ok: boolean; count: number; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { ok: false, count: 0, error: 'Supabase credentials are not configured.' };
    }

    try {
      const profile = getLocalProfile();
      await supabase.from('profile').upsert({
        id: profile.id,
        full_name: profile.fullName,
        professional_title: profile.professionalTitle,
        institution: profile.institution,
        year_level: profile.yearLevel,
        location: profile.location,
        email: profile.email,
        github_url: profile.githubUrl,
        facebook_url: profile.facebookUrl,
        instagram_url: profile.instagramUrl,
        biography: profile.biography,
        hero_intro: profile.heroIntro,
        profile_image_url: profile.profileImageUrl,
        updated_at: profile.updatedAt,
      });

      const projects = getLocalProjects();
      for (const p of projects) {
        await supabase.from('projects').upsert({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description,
          objectives: p.objectives,
          key_features: p.keyFeatures,
          technologies: p.technologies,
          contribution: p.contribution,
          status: p.status,
          order_index: p.orderIndex,
          created_at: p.createdAt,
          updated_at: p.updatedAt,
        });

        for (const img of p.images) {
          if (!img.imageUrl.startsWith('data:')) {
            await supabase.from('project_images').upsert({
              id: img.id,
              project_id: p.id,
              image_url: img.imageUrl,
              is_main: img.isMain,
              order_index: img.orderIndex,
              created_at: img.createdAt,
            });
          }
        }
      }

      const skills = getLocalSkills();
      for (const s of skills) {
        await supabase.from('skills').upsert({
          id: s.id,
          name: s.name,
          category: s.category,
          order_index: s.orderIndex,
        });
      }

      const education = getLocalEducation();
      for (const e of education) {
        await supabase.from('education').upsert({
          id: e.id,
          institution: e.institution,
          program: e.program,
          year_level: e.yearLevel,
          details: e.details,
        });
      }

      return { ok: true, count: projects.length + skills.length };
    } catch (err: any) {
      return { ok: false, count: 0, error: err.message || 'Unknown error syncing to Supabase' };
    }
  },

  // 7. RESTORE FACTORY DEFAULTS
  resetToDefaults(): void {
    setLocalProfile(initialProfile);
    setLocalProjects(initialProjects);
    setLocalSkills(initialSkills);
    setLocalEducation(initialEducation);
    setLocalMessages([]);
  },
};
