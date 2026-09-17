import type { User, UserSkill, Project, Experience, Certification } from '../types';

export const currentUser: User = {
  id: 'u1',
  name: 'Rahul Mehta',
  email: 'rahul.mehta@example.com',
  location: 'Pune, India',
  education: 'B.Tech, Information Technology',
  graduationYear: 2026,
  experienceLevel: 'Student',
  avatarColor: '#2563EB',
  targetCareer: 'Backend Developer',
  profileCompleteness: 78,
};

export const userSkills: UserSkill[] = [
  { name: 'Java', proficiency: 'Advanced' },
  { name: 'SQL', proficiency: 'Advanced' },
  { name: 'Git', proficiency: 'Intermediate' },
  { name: 'React', proficiency: 'Intermediate' },
  { name: 'Python', proficiency: 'Intermediate' },
  { name: 'DSA', proficiency: 'Intermediate' },
  { name: 'HTML/CSS', proficiency: 'Advanced' },
  { name: 'Linux', proficiency: 'Beginner' },
];

export const userProjects: Project[] = [
  {
    id: 'p1',
    title: 'E-commerce Platform',
    description: 'A full-stack storefront with cart, checkout and an admin dashboard for inventory.',
    skills: ['Java', 'Spring Boot', 'React', 'MySQL'],
    link: 'https://github.com/rahulmehta/ecommerce-platform',
  },
  {
    id: 'p2',
    title: 'Student Management System',
    description: 'Desktop application for attendance, grading and report generation used by a local college.',
    skills: ['Java', 'SQL', 'JavaFX'],
  },
  {
    id: 'p3',
    title: 'Campus Events Tracker',
    description: 'A React + Firebase app that lets student clubs publish and RSVP to events.',
    skills: ['React', 'Firebase', 'Tailwind CSS'],
    link: 'https://github.com/rahulmehta/campus-events',
  },
];

export const userExperience: Experience[] = [
  {
    id: 'e1',
    role: 'Software Engineering Intern',
    company: 'Nimbus Cloud Labs',
    duration: 'May 2025 – Jul 2025',
    description: 'Built internal REST APIs for a billing microservice and wrote integration tests, reducing regression bugs by 30%.',
  },
];

export const userCertifications: Certification[] = [
  { id: 'c1', name: 'Java Programming Masterclass', issuer: 'Udemy', year: 2024 },
  { id: 'c2', name: 'SQL for Data Analysis', issuer: 'Coursera', year: 2025 },
];

export const userInterests: string[] = ['Software Development', 'AI/ML', 'Cloud'];
