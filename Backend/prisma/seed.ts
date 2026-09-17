import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SYNTHETIC_JOBS = [
  {
    title: 'Senior Backend Engineer',
    company: 'TechCorp Alpha',
    location: 'San Francisco, CA',
    remote: false,
    salaryMin: 140000,
    salaryMax: 180000,
    skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
  },
  {
    title: 'Full Stack Developer',
    company: 'StartupBeta',
    location: 'New York, NY',
    remote: true,
    salaryMin: 110000,
    salaryMax: 150000,
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
  },
  {
    title: 'Data Engineer',
    company: 'DataDriven Inc',
    location: 'Seattle, WA',
    remote: false,
    salaryMin: 130000,
    salaryMax: 170000,
    skills: ['Python', 'Spark', 'SQL', 'Airflow', 'AWS'],
  },
  {
    title: 'Machine Learning Engineer',
    company: 'AI Ventures',
    location: 'Austin, TX',
    remote: true,
    salaryMin: 150000,
    salaryMax: 200000,
    skills: ['Python', 'PyTorch', 'TensorFlow', 'SQL', 'Docker'],
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudFirst',
    location: 'Chicago, IL',
    remote: true,
    salaryMin: 120000,
    salaryMax: 160000,
    skills: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'CI/CD'],
  },
  {
    title: 'Frontend Engineer',
    company: 'UXLabs',
    location: 'Los Angeles, CA',
    remote: false,
    salaryMin: 100000,
    salaryMax: 140000,
    skills: ['React', 'TypeScript', 'CSS', 'GraphQL', 'Jest'],
  },
  {
    title: 'Platform Engineer',
    company: 'ScaleSystems',
    location: 'Boston, MA',
    remote: true,
    salaryMin: 145000,
    salaryMax: 185000,
    skills: ['Go', 'Kubernetes', 'Terraform', 'PostgreSQL', 'gRPC'],
  },
  {
    title: 'Security Engineer',
    company: 'SecureNet',
    location: 'Washington, DC',
    remote: false,
    salaryMin: 135000,
    salaryMax: 175000,
    skills: ['Python', 'Security', 'AWS', 'SIEM', 'Penetration Testing'],
  },
  {
    title: 'iOS Developer',
    company: 'MobileTech',
    location: 'San Jose, CA',
    remote: false,
    salaryMin: 120000,
    salaryMax: 160000,
    skills: ['Swift', 'Objective-C', 'Xcode', 'CoreData', 'UIKit'],
  },
  {
    title: 'Android Developer',
    company: 'AppFactory',
    location: 'Denver, CO',
    remote: true,
    salaryMin: 115000,
    salaryMax: 155000,
    skills: ['Kotlin', 'Java', 'Android SDK', 'Room', 'Jetpack Compose'],
  },
  {
    title: 'Backend Engineer (Go)',
    company: 'Microservices Co',
    location: 'Portland, OR',
    remote: true,
    salaryMin: 125000,
    salaryMax: 165000,
    skills: ['Go', 'gRPC', 'PostgreSQL', 'Redis', 'Docker'],
  },
  {
    title: 'Data Scientist',
    company: 'AnalyticsPro',
    location: 'Atlanta, GA',
    remote: false,
    salaryMin: 120000,
    salaryMax: 160000,
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Tableau'],
  },
  {
    title: 'Cloud Architect',
    company: 'CloudArch',
    location: 'Phoenix, AZ',
    remote: true,
    salaryMin: 160000,
    salaryMax: 210000,
    skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Architecture'],
  },
  {
    title: 'Site Reliability Engineer',
    company: 'ReliableOps',
    location: 'San Francisco, CA',
    remote: false,
    salaryMin: 150000,
    salaryMax: 190000,
    skills: ['Python', 'Go', 'Kubernetes', 'Prometheus', 'Grafana'],
  },
  {
    title: 'Database Administrator',
    company: 'DataStore Inc',
    location: 'Dallas, TX',
    remote: false,
    salaryMin: 110000,
    salaryMax: 145000,
    skills: ['PostgreSQL', 'MySQL', 'Oracle', 'SQL', 'Performance Tuning'],
  },
  {
    title: 'React Native Developer',
    company: 'CrossPlatform',
    location: 'Miami, FL',
    remote: true,
    salaryMin: 105000,
    salaryMax: 145000,
    skills: ['React Native', 'TypeScript', 'Redux', 'GraphQL', 'iOS', 'Android'],
  },
  {
    title: 'Blockchain Developer',
    company: 'Web3Corp',
    location: 'New York, NY',
    remote: true,
    salaryMin: 140000,
    salaryMax: 190000,
    skills: ['Solidity', 'Web3.js', 'Ethereum', 'TypeScript', 'Node.js'],
  },
  {
    title: 'QA Automation Engineer',
    company: 'QualityFirst',
    location: 'Minneapolis, MN',
    remote: false,
    salaryMin: 90000,
    salaryMax: 125000,
    skills: ['Python', 'Selenium', 'Jest', 'Cypress', 'API Testing'],
  },
  {
    title: 'Technical Lead',
    company: 'LeadTech',
    location: 'San Francisco, CA',
    remote: false,
    salaryMin: 170000,
    salaryMax: 220000,
    skills: ['System Design', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'Leadership'],
  },
  {
    title: 'API Developer',
    company: 'APIFirst',
    location: 'Remote',
    remote: true,
    salaryMin: 100000,
    salaryMax: 140000,
    skills: ['Node.js', 'REST', 'GraphQL', 'TypeScript', 'PostgreSQL'],
  },
];

async function main() {
  console.log('Seeding database with SYNTHETIC data (illustrative only)...');

  // ─── Seed Jobs ─────────────────────────────────────────────────────────────
  for (let i = 0; i < SYNTHETIC_JOBS.length; i++) {
    const job = SYNTHETIC_JOBS[i];
    await prisma.job.upsert({
      where: {
        source_sourceId: { source: 'synthetic-seed', sourceId: `seed-job-${i + 1}` },
      },
      update: {},
      create: {
        title: job.title,
        company: job.company,
        description: `${job.title} position at ${job.company}. SYNTHETIC DATA — illustrative only.`,
        location: job.location,
        remote: job.remote,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        skillsRequired: job.skills,
        source: 'synthetic-seed',
        sourceId: `seed-job-${i + 1}`,
        postedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log(`Seeded ${SYNTHETIC_JOBS.length} synthetic jobs`);

  // ─── Seed Raw Job Postings ──────────────────────────────────────────────────
  for (let i = 0; i < 5; i++) {
    await prisma.jobPostingRaw.upsert({
      where: {
        source_sourceId: { source: 'synthetic-raw', sourceId: `raw-${i + 1}` },
      },
      update: {},
      create: {
        source: 'synthetic-raw',
        sourceId: `raw-${i + 1}`,
        rawPayload: {
          title: `Raw Job ${i + 1}`,
          company: 'Raw Corp',
          note: 'SYNTHETIC DATA — illustrative only',
        },
        processed: false,
      },
    });
  }
  console.log('Seeded 5 raw job postings');

  // ─── Seed Skill Trends ──────────────────────────────────────────────────────
  const periodStart = new Date('2024-01-01');
  const periodEnd = new Date('2024-03-31');
  const trendSkills = [
    { skill: 'TypeScript', count: 450, salaryLow: 120000, salaryHigh: 175000 },
    { skill: 'Python', count: 520, salaryLow: 115000, salaryHigh: 165000 },
    { skill: 'React', count: 380, salaryLow: 100000, salaryHigh: 155000 },
    { skill: 'Node.js', count: 340, salaryLow: 110000, salaryHigh: 160000 },
    { skill: 'PostgreSQL', count: 290, salaryLow: 110000, salaryHigh: 165000 },
    { skill: 'Docker', count: 410, salaryLow: 120000, salaryHigh: 175000 },
    { skill: 'Kubernetes', count: 280, salaryLow: 130000, salaryHigh: 185000 },
    { skill: 'AWS', count: 490, salaryLow: 125000, salaryHigh: 180000 },
    { skill: 'Go', count: 180, salaryLow: 125000, salaryHigh: 170000 },
    { skill: 'Terraform', count: 220, salaryLow: 130000, salaryHigh: 175000 },
  ];

  for (const trend of trendSkills) {
    await prisma.skillTrend.upsert({
      where: {
        skillName_periodStart_periodEnd: {
          skillName: trend.skill,
          periodStart,
          periodEnd,
        },
      },
      update: {},
      create: {
        skillName: trend.skill,
        demandCount: trend.count,
        periodStart,
        periodEnd,
        avgSalaryLow: trend.salaryLow,
        avgSalaryHigh: trend.salaryHigh,
      },
    });
  }
  console.log('Seeded 10 skill trends');

  // ─── Seed Salary Benchmarks ─────────────────────────────────────────────────
  const benchmarks = [
    { role: 'Backend Engineer', location: 'global', p25: 110000, p50: 140000, p75: 175000, n: 45 },
    { role: 'Frontend Engineer', location: 'global', p25: 95000, p50: 125000, p75: 160000, n: 38 },
    { role: 'Data Engineer', location: 'global', p25: 115000, p50: 145000, p75: 180000, n: 30 },
    {
      role: 'Machine Learning Engineer',
      location: 'global',
      p25: 130000,
      p50: 165000,
      p75: 205000,
      n: 25,
    },
    { role: 'DevOps Engineer', location: 'global', p25: 110000, p50: 140000, p75: 175000, n: 28 },
  ];

  for (const b of benchmarks) {
    await prisma.salaryBenchmark.upsert({
      where: {
        roleTitle_location_period: {
          roleTitle: b.role,
          location: b.location,
          period: '2024-Q1',
        },
      },
      update: {},
      create: {
        roleTitle: b.role,
        location: b.location,
        percentile25: b.p25,
        percentile50: b.p50,
        percentile75: b.p75,
        sampleSize: b.n,
        period: '2024-Q1',
      },
    });
  }
  console.log('Seeded 5 salary benchmarks');
  console.log('⚠️  All seeded data is SYNTHETIC and illustrative only. Not real market data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
