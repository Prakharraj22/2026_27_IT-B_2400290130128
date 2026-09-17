export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  education: string;
  graduationYear: number;
  experienceLevel: 'Student' | 'Fresher' | '1-3 years' | '3-5 years' | '5+ years';
  avatarColor: string;
  targetCareer: string;
  profileCompleteness: number;
}

export type Proficiency = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserSkill {
  name: string;
  proficiency: Proficiency;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  link?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: number;
}

export type SkillPriority = 'High' | 'Medium' | 'Low';

export interface SkillGapItem {
  name: string;
  priority: SkillPriority;
  reason: string;
}

export interface Career {
  id: string;
  title: string;
  description: string;
  alignment: number;
  requiredSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  aiExplanation: string;
  recommendedProjects: string[];
  learningSuggestions: string[];
  potentialRoles: string[];
  medianSalary: string;
  demand: 'High' | 'Growing' | 'Steady';
}

export type RoadmapStatus = 'Completed' | 'In Progress' | 'Locked' | 'Not Started';

export interface RoadmapStep {
  id: string;
  skill: string;
  description: string;
  status: RoadmapStatus;
  progress: number;
  prerequisites: string[];
  estimatedTime: string;
  resources: { title: string; type: string }[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  salary: string;
  experience: string;
  type: 'Full-time' | 'Internship' | 'Contract' | 'Part-time';
  requiredSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  compatibility: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  companyInfo: string;
  postedDaysAgo: number;
  saved: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'career' | 'resume' | 'job' | 'roadmap' | 'skill' | 'profile';
  read: boolean;
  timestamp: string;
}

export interface ResumeAnalysis {
  fileName: string;
  fileSize: string;
  uploadDate: string;
  skillsDetected: string[];
  projectsDetected: string[];
  educationDetected: string[];
  experienceDetected: string[];
  certificationsDetected: string[];
  strengths: string[];
  weakAreas: string[];
  suggestions: string[];
}

export interface TrendingSkill {
  name: string;
  demandChange: number;
  category: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  timestamp: string;
  icon: 'resume' | 'career' | 'roadmap' | 'job';
}
