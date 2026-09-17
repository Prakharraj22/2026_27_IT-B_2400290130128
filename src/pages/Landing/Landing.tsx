import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Compass, FileText, Target, Map, Briefcase, TrendingUp,
  UserPlus, Upload, Sparkles, CheckCircle2, Sprout, Route,
} from 'lucide-react';
import { LandingHeader } from '../../components/landing/LandingHeader';
import { Button, Card, CircularProgress, Badge, ProgressBar } from '../../components/ui';

const steps = [
  { n: '01', title: 'Create Profile', desc: 'Tell us your education, skills and where you want to go.', icon: UserPlus },
  { n: '02', title: 'Upload Resume', desc: 'Drop in your resume and let the AI extract the details.', icon: Upload },
  { n: '03', title: 'AI Analysis', desc: 'We evaluate your profile against real career requirements.', icon: Sparkles },
  { n: '04', title: 'Discover Career Paths', desc: 'See which careers fit you best, ranked by alignment.', icon: Compass },
  { n: '05', title: 'Identify Skill Gaps', desc: 'Know exactly which skills stand between you and the role.', icon: Target },
  { n: '06', title: 'Build Your Roadmap', desc: 'Follow a step-by-step plan to close the gap.', icon: Route },
];

const features = [
  { title: 'Career Intelligence', desc: 'Personalized career recommendations ranked by how well they fit your actual profile.', icon: Compass },
  { title: 'Resume Intelligence', desc: 'Automatic extraction of skills, projects and experience, with AI-written strengths and gaps.', icon: FileText },
  { title: 'Skill Gap Analysis', desc: 'A clear, prioritized list of what to learn next for your target career.', icon: Target },
  { title: 'Personalized Roadmap', desc: 'A sequenced learning path from where you are to where you want to be.', icon: Map },
  { title: 'Job Matching', desc: 'Jobs ranked by compatibility, with the exact skills you match and miss.', icon: Briefcase },
  { title: 'Market Intelligence', desc: 'Trending skills, demand shifts and salary context to guide your decisions.', icon: TrendingUp },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark">
      <LandingHeader />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge variant="ai" className="mb-5">
            <Sparkles className="h-3 w-3" /> AI-powered career intelligence
          </Badge>
          <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Understand Your Career.
            <br />
            Build Your Path.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-light dark:text-muted-dark">
            AI-powered career intelligence based on your skills, resume, experience and goals.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup">
              <Button size="lg" icon={<Sparkles className="h-4 w-4" />}>Analyze My Career</Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline">Explore Careers</Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink-light dark:text-ink-dark">Career dashboard</p>
                <p className="text-xs text-muted-light dark:text-muted-dark">Backend Developer track</p>
              </div>
              <CircularProgress value={78} size={56} strokeWidth={5} label="profile" />
            </div>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border-light dark:border-border-dark p-3">
                <p className="text-xs text-muted-light dark:text-muted-dark">Career alignment</p>
                <p className="text-xl font-bold font-display">82%</p>
              </div>
              <div className="rounded-xl border border-border-light dark:border-border-dark p-3">
                <p className="text-xs text-muted-light dark:text-muted-dark">Job matches</p>
                <p className="text-xl font-bold font-display">12</p>
              </div>
            </div>
            <p className="mb-2 text-xs font-medium text-muted-light dark:text-muted-dark">Spring Boot</p>
            <ProgressBar value={55} className="mb-4" />
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Java</Badge>
              <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> SQL</Badge>
              <Badge variant="neutral">Docker</Badge>
              <Badge variant="neutral">System Design</Badge>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="border-t border-border-light dark:border-border-dark bg-surface-light/60 dark:bg-surface-dark/40 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-2xl font-bold lg:text-3xl">How It Works</h2>
          <p className="mt-2 max-w-lg text-muted-light dark:text-muted-dark">Six steps from a blank profile to a plan you can actually follow.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <Card key={s.n} className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                    <s.icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-display text-xs font-semibold text-muted-light dark:text-muted-dark">{s.n}</span>
                </div>
                <h3 className="text-sm font-semibold text-ink-light dark:text-ink-dark">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-2xl font-bold lg:text-3xl">Everything your career decisions need</h2>
          <p className="mt-2 max-w-lg text-muted-light dark:text-muted-dark">One command center instead of six disconnected tools.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} accent="primary" className="p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                  <f.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-sm font-semibold text-ink-light dark:text-ink-dark">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border-light dark:border-border-dark py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Sprout className="mx-auto mb-4 h-8 w-8 text-primary-600 dark:text-primary-300" />
          <h2 className="text-2xl font-bold lg:text-3xl">Your next career move starts with knowing where you stand.</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-light dark:text-muted-dark">Create a profile in minutes and get your first career analysis today.</p>
          <Link to="/signup" className="mt-7 inline-block">
            <Button size="lg" icon={<ArrowRight className="h-4 w-4" />}>Analyze My Career</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-light dark:border-border-dark py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted-light dark:text-muted-dark sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-600 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="font-display font-semibold text-ink-light dark:text-ink-dark">CareerAI</span>
          </div>
          <p>© {new Date().getFullYear()} CareerAI. Built for demo purposes.</p>
        </div>
      </footer>
    </div>
  );
}
