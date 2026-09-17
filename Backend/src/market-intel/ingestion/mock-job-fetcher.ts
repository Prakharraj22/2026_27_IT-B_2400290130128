import { Injectable, Logger } from '@nestjs/common';
import { IJobFetcher, RawJobData, FetchOptions } from './job-fetcher.interface';

/**
 * SYNTHETIC MOCK JOB FETCHER
 * ⚠️  All job data is synthetic and illustrative only.
 * ⚠️  NOT real postings. NOT real market data.
 * Can be swapped for an external API fetcher by implementing IJobFetcher.
 */
@Injectable()
export class MockJobFetcher implements IJobFetcher {
  readonly sourceName = 'synthetic-mock';
  private readonly logger = new Logger(MockJobFetcher.name);

  private readonly SYNTHETIC_JOBS: RawJobData[] = [
    { sourceId: 'mock-001', title: 'Senior Backend Engineer', company: 'TechAlpha', location: 'San Francisco, CA', remote: false, salaryMin: 140000, salaryMax: 180000, skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'], postedAt: new Date('2024-01-15') },
    { sourceId: 'mock-002', title: 'Full Stack Developer', company: 'StartupBeta', location: 'New York, NY', remote: true, salaryMin: 110000, salaryMax: 150000, skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'], postedAt: new Date('2024-01-20') },
    { sourceId: 'mock-003', title: 'Data Engineer', company: 'DataPros', location: 'Seattle, WA', remote: false, salaryMin: 130000, salaryMax: 170000, skills: ['Python', 'Spark', 'SQL', 'Airflow', 'AWS'], postedAt: new Date('2024-01-25') },
    { sourceId: 'mock-004', title: 'Machine Learning Engineer', company: 'AIVentures', location: 'Austin, TX', remote: true, salaryMin: 150000, salaryMax: 200000, skills: ['Python', 'PyTorch', 'TensorFlow', 'SQL', 'Docker'], postedAt: new Date('2024-02-01') },
    { sourceId: 'mock-005', title: 'DevOps Engineer', company: 'CloudFirst', location: 'Chicago, IL', remote: true, salaryMin: 120000, salaryMax: 160000, skills: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'CI/CD'], postedAt: new Date('2024-02-05') },
    { sourceId: 'mock-006', title: 'Frontend Engineer', company: 'UXLabs', location: 'Los Angeles, CA', remote: false, salaryMin: 100000, salaryMax: 140000, skills: ['React', 'TypeScript', 'CSS', 'GraphQL', 'Jest'], postedAt: new Date('2024-02-10') },
    { sourceId: 'mock-007', title: 'Platform Engineer', company: 'ScaleSys', location: 'Boston, MA', remote: true, salaryMin: 145000, salaryMax: 185000, skills: ['Go', 'Kubernetes', 'Terraform', 'PostgreSQL'], postedAt: new Date('2024-02-15') },
    { sourceId: 'mock-008', title: 'Backend Engineer (Python)', company: 'PyCorp', location: 'Denver, CO', remote: true, salaryMin: 120000, salaryMax: 160000, skills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'], postedAt: new Date('2024-02-20') },
    { sourceId: 'mock-009', title: 'Cloud Architect', company: 'CloudArch', location: 'Phoenix, AZ', remote: true, salaryMin: 160000, salaryMax: 210000, skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes'], postedAt: new Date('2024-03-01') },
    { sourceId: 'mock-010', title: 'Site Reliability Engineer', company: 'ReliableOps', location: 'San Francisco, CA', remote: false, salaryMin: 150000, salaryMax: 190000, skills: ['Python', 'Go', 'Kubernetes', 'Prometheus', 'Grafana'], postedAt: new Date('2024-03-05') },
    { sourceId: 'mock-011', title: 'Data Scientist', company: 'Analytics+', location: 'Atlanta, GA', remote: false, salaryMin: 120000, salaryMax: 160000, skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Tableau'], postedAt: new Date('2024-03-10') },
    { sourceId: 'mock-012', title: 'iOS Developer', company: 'MobileFirst', location: 'San Jose, CA', remote: false, salaryMin: 120000, salaryMax: 160000, skills: ['Swift', 'Xcode', 'CoreData', 'UIKit'], postedAt: new Date('2024-03-15') },
    { sourceId: 'mock-013', title: 'Android Developer', company: 'AppFactory', location: 'Denver, CO', remote: true, salaryMin: 115000, salaryMax: 155000, skills: ['Kotlin', 'Android SDK', 'Room', 'Jetpack Compose'], postedAt: new Date('2024-03-20') },
    { sourceId: 'mock-014', title: 'Backend Engineer (Go)', company: 'MicroSvc', location: 'Portland, OR', remote: true, salaryMin: 125000, salaryMax: 165000, skills: ['Go', 'gRPC', 'PostgreSQL', 'Redis', 'Docker'], postedAt: new Date('2024-01-10') },
    { sourceId: 'mock-015', title: 'Security Engineer', company: 'SecureNet', location: 'Washington, DC', remote: false, salaryMin: 135000, salaryMax: 175000, skills: ['Python', 'Security', 'AWS', 'SIEM'], postedAt: new Date('2024-01-12') },
    { sourceId: 'mock-016', title: 'QA Automation Engineer', company: 'QualityFirst', location: 'Minneapolis, MN', remote: false, salaryMin: 90000, salaryMax: 125000, skills: ['Python', 'Selenium', 'Jest', 'Cypress'], postedAt: new Date('2024-02-08') },
    { sourceId: 'mock-017', title: 'React Native Developer', company: 'CrossPlat', location: 'Miami, FL', remote: true, salaryMin: 105000, salaryMax: 145000, skills: ['React Native', 'TypeScript', 'Redux', 'GraphQL'], postedAt: new Date('2024-02-12') },
    { sourceId: 'mock-018', title: 'Database Administrator', company: 'DataStore', location: 'Dallas, TX', remote: false, salaryMin: 110000, salaryMax: 145000, skills: ['PostgreSQL', 'MySQL', 'SQL', 'Performance Tuning'], postedAt: new Date('2024-02-25') },
    { sourceId: 'mock-019', title: 'Technical Lead', company: 'LeadTech', location: 'San Francisco, CA', remote: false, salaryMin: 170000, salaryMax: 220000, skills: ['System Design', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'], postedAt: new Date('2024-03-08') },
    { sourceId: 'mock-020', title: 'API Developer', company: 'APIFirst', location: 'Remote', remote: true, salaryMin: 100000, salaryMax: 140000, skills: ['Node.js', 'REST', 'GraphQL', 'TypeScript', 'PostgreSQL'], postedAt: new Date('2024-03-12') },
  ];

  async fetch(options?: FetchOptions): Promise<RawJobData[]> {
    this.logger.warn('⚠️  Using SYNTHETIC mock job postings — illustrative only');
    let jobs = [...this.SYNTHETIC_JOBS];
    if (options?.since) {
      jobs = jobs.filter((j) => j.postedAt && j.postedAt >= options.since!);
    }
    if (options?.limit) {
      jobs = jobs.slice(0, options.limit);
    }
    return jobs;
  }
}
