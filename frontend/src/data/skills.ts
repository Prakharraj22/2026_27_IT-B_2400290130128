import type { SkillGapItem, TrendingSkill } from '../types';

export const allSkillsCatalog: string[] = [
  'Java', 'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'MongoDB',
  'Spring Boot', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'Linux',
  'System Design', 'DSA', 'REST APIs', 'GraphQL', 'HTML/CSS', 'Tailwind CSS',
  'PyTorch', 'TensorFlow', 'Statistics', 'Power BI', 'Excel', 'Terraform',
  'CI/CD', 'Redis', 'Kafka', 'Flutter', 'Swift', 'Kotlin', 'C++', 'Go', 'Rust',
];

export const skillGapForBackendDeveloper: SkillGapItem[] = [
  { name: 'Spring Boot', priority: 'High', reason: 'The most widely used Java framework for backend roles \u2014 nearly every backend job listing for your target career requires it.' },
  { name: 'REST APIs', priority: 'High', reason: 'API design shows up in take-home assignments and interviews as a core screening skill.' },
  { name: 'Docker', priority: 'Medium', reason: 'Containerization is expected for deployment-ready backend work, though many teams will train you on the job.' },
  { name: 'System Design', priority: 'Low', reason: 'More relevant once you\u2019re interviewing for mid-level roles; early-career screens rarely go deep here.' },
];

export const trendingSkills: TrendingSkill[] = [
  { name: 'System Design', demandChange: 34, category: 'Engineering' },
  { name: 'Docker', demandChange: 28, category: 'DevOps' },
  { name: 'Python', demandChange: 22, category: 'Programming' },
  { name: 'AWS', demandChange: 26, category: 'Cloud' },
  { name: 'React', demandChange: 18, category: 'Frontend' },
  { name: 'SQL', demandChange: 12, category: 'Data' },
  { name: 'Kubernetes', demandChange: 31, category: 'DevOps' },
  { name: 'TypeScript', demandChange: 19, category: 'Programming' },
];

export const emergingTechnologies: string[] = [
  'Retrieval-Augmented Generation (RAG)', 'AI Agents & Orchestration', 'Edge Computing',
  'WebAssembly', 'Vector Databases', 'Platform Engineering',
];

export const careerDemandByLocation = [
  { location: 'Bengaluru', demand: 92 },
  { location: 'Hyderabad', demand: 84 },
  { location: 'Pune', demand: 79 },
  { location: 'Gurugram', demand: 76 },
  { location: 'Remote', demand: 88 },
];

export const salaryTrends = [
  { role: 'Backend Developer', range: '₹6L \u2013 ₹18L', median: '₹10L' },
  { role: 'Software Engineer', range: '₹6L \u2013 ₹20L', median: '₹10.5L' },
  { role: 'Data Analyst', range: '₹4L \u2013 ₹12L', median: '₹7L' },
  { role: 'ML Engineer', range: '₹8L \u2013 ₹28L', median: '₹14L' },
];
