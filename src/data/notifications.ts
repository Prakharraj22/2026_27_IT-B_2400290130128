import type { NotificationItem, ActivityItem, ResumeAnalysis } from '../types';

export const notifications: NotificationItem[] = [
  { id: 'n1', title: 'Career analysis completed', message: 'Your updated career recommendations are ready to view.', type: 'career', read: false, timestamp: '10 minutes ago' },
  { id: 'n2', title: 'New job matches found', message: '3 new jobs match your Backend Developer profile.', type: 'job', read: false, timestamp: '2 hours ago' },
  { id: 'n3', title: 'Resume analysis completed', message: 'We detected 5 new skills from your latest resume upload.', type: 'resume', read: false, timestamp: '1 day ago' },
  { id: 'n4', title: 'Roadmap updated', message: 'Spring Boot has moved to In Progress based on your activity.', type: 'roadmap', read: true, timestamp: '2 days ago' },
  { id: 'n5', title: 'New skill recommendation', message: 'Docker was added to your skill gap as a medium priority.', type: 'skill', read: true, timestamp: '3 days ago' },
  { id: 'n6', title: 'Profile incomplete', message: 'Add your certifications to improve your profile completeness.', type: 'profile', read: true, timestamp: '5 days ago' },
];

export const recentActivity: ActivityItem[] = [
  { id: 'a1', label: 'Resume analyzed', timestamp: '1 day ago', icon: 'resume' },
  { id: 'a2', label: 'Career analysis completed', timestamp: '10 minutes ago', icon: 'career' },
  { id: 'a3', label: 'Roadmap updated \u2014 Spring Boot in progress', timestamp: '2 days ago', icon: 'roadmap' },
  { id: 'a4', label: 'New jobs found for Backend Developer', timestamp: '2 hours ago', icon: 'job' },
];

export const mockResumeAnalysis: ResumeAnalysis = {
  fileName: 'Rahul_Mehta_Resume.pdf',
  fileSize: '214 KB',
  uploadDate: 'Today',
  skillsDetected: ['Java', 'React', 'SQL', 'Git', 'Spring Boot', 'HTML/CSS', 'Python'],
  projectsDetected: ['E-commerce Platform', 'Student Management System'],
  educationDetected: ['B.Tech, Information Technology'],
  experienceDetected: ['Software Engineering Intern \u2014 Nimbus Cloud Labs'],
  certificationsDetected: ['Java Programming Masterclass', 'SQL for Data Analysis'],
  strengths: [
    'Strong, consistent Java project history across three separate projects',
    'Clear ownership language in the internship bullet points',
    'Good coverage of both frontend and backend skills',
  ],
  weakAreas: [
    'No quantified impact metrics on the Student Management System project',
    'Missing evidence of testing or CI/CD practices',
    'Docker and deployment experience not mentioned anywhere',
  ],
  suggestions: [
    'Add measurable outcomes to each project bullet (e.g. users served, performance gained)',
    'Mention any testing frameworks used, even at a basic level',
    'Consider adding a short "Skills in progress" section to signal growth areas',
  ],
};
