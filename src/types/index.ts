export interface Profile {
  id: string;
  fullName: string;
  professionalTitle: string;
  institution: string;
  yearLevel: string;
  location: string;
  email: string;
  githubUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  biography: string;
  heroIntro: string;
  profileImageUrl: string | null;
  updatedAt: string;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  imageUrl: string;
  caption?: string;
  isMain: boolean;
  orderIndex: number;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  objectives?: string;
  keyFeatures?: string;
  technologies: string[];
  contribution?: string;
  status?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  images: ProjectImage[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'Programming and Web' | 'Hardware and Engineering' | 'Design and Productivity' | 'Development Platform' | string;
  orderIndex: number;
}

export interface Education {
  id: string;
  institution: string;
  program: string;
  yearLevel: string;
  details?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}
