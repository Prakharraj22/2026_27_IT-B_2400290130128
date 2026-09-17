import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, MapPin, GraduationCap, Briefcase as BriefcaseIcon, Award, Target, ExternalLink } from 'lucide-react';
import { Topbar } from '../../components/layout/Topbar';
import { Card, Badge, Button, Avatar, Modal, Input, Select } from '../../components/ui';
import { SkillCard } from '../../components/skills/SkillCard';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import {
  getSkills, getProjects, addProject, removeProject,
  getExperience, addExperience, removeExperience,
  getCertifications, addCertification, removeCertification,
  getInterests, updateProfile,
} from '../../services/api/profileApi';
import type { UserSkill, Project, Experience, Certification, User } from '../../types';

const EXPERIENCE_LEVELS: User['experienceLevel'][] = ['Student', 'Fresher', '1-3 years', '3-5 years', '5+ years'];

const emptyProjectForm = { title: '', description: '', skills: '', link: '' };
const emptyExperienceForm = { role: '', company: '', duration: '', description: '' };
const emptyCertForm = { name: '', issuer: '', year: String(new Date().getFullYear()) };

export function Profile() {
  const { user, login } = useApp();
  const { showToast } = useToast();
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Pick<User, 'name' | 'location' | 'education' | 'graduationYear' | 'experienceLevel' | 'targetCareer'> | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [savingProject, setSavingProject] = useState(false);

  const [addExperienceOpen, setAddExperienceOpen] = useState(false);
  const [experienceForm, setExperienceForm] = useState(emptyExperienceForm);
  const [savingExperience, setSavingExperience] = useState(false);

  const [addCertOpen, setAddCertOpen] = useState(false);
  const [certForm, setCertForm] = useState(emptyCertForm);
  const [savingCert, setSavingCert] = useState(false);

  useEffect(() => {
    getSkills().then(setSkills);
    getProjects().then(setProjects);
    getExperience().then(setExperience);
    getCertifications().then(setCertifications);
    getInterests().then(setInterests);
  }, []);

  const removeSkill = (name: string) => {
    setSkills((s) => s.filter((sk) => sk.name !== name));
    showToast(`${name} removed for this session.`, 'info');
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills((s) => [...s, { name: newSkillName.trim(), proficiency: 'Beginner' }]);
    setNewSkillName('');
    setAddSkillOpen(false);
    // Skills are owned by the Resume Module (the backend rejects writing
    // them through the profile update endpoint), so this is session-only —
    // it won't survive a refresh yet. Said plainly so it isn't mistaken for
    // a real save.
    showToast('Skill added for this session — persistent skill sync is coming soon.', 'info');
  };

  const saveProject = async () => {
    if (!projectForm.title.trim()) return;
    setSavingProject(true);
    try {
      const updated = await addProject({
        title: projectForm.title.trim(),
        description: projectForm.description.trim(),
        skills: projectForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
        link: projectForm.link.trim() || undefined,
      });
      setProjects(updated);
      setProjectForm(emptyProjectForm);
      setAddProjectOpen(false);
      showToast('Project added.', 'success');
    } catch {
      showToast('Could not add the project. Please try again.', 'error');
    } finally {
      setSavingProject(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setProjects(await removeProject(id));
      showToast('Project removed.', 'info');
    } catch {
      showToast('Could not remove the project. Please try again.', 'error');
    }
  };

  const saveExperience = async () => {
    if (!experienceForm.role.trim() || !experienceForm.company.trim()) return;
    setSavingExperience(true);
    try {
      const updated = await addExperience({
        role: experienceForm.role.trim(),
        company: experienceForm.company.trim(),
        duration: experienceForm.duration.trim(),
        description: experienceForm.description.trim(),
      });
      setExperience(updated);
      setExperienceForm(emptyExperienceForm);
      setAddExperienceOpen(false);
      showToast('Experience added.', 'success');
    } catch {
      showToast('Could not add the experience entry. Please try again.', 'error');
    } finally {
      setSavingExperience(false);
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      setExperience(await removeExperience(id));
      showToast('Experience removed.', 'info');
    } catch {
      showToast('Could not remove the entry. Please try again.', 'error');
    }
  };

  const saveCertification = async () => {
    if (!certForm.name.trim() || !certForm.issuer.trim()) return;
    setSavingCert(true);
    try {
      const updated = await addCertification({
        name: certForm.name.trim(),
        issuer: certForm.issuer.trim(),
        year: Number(certForm.year) || new Date().getFullYear(),
      });
      setCertifications(updated);
      setCertForm(emptyCertForm);
      setAddCertOpen(false);
      showToast('Certification added.', 'success');
    } catch {
      showToast('Could not add the certification. Please try again.', 'error');
    } finally {
      setSavingCert(false);
    }
  };

  const deleteCertification = async (id: string) => {
    try {
      setCertifications(await removeCertification(id));
      showToast('Certification removed.', 'info');
    } catch {
      showToast('Could not remove the certification. Please try again.', 'error');
    }
  };

  const openEdit = () => {
    if (!user) return;
    setEditForm({
      name: user.name,
      location: user.location,
      education: user.education,
      graduationYear: user.graduationYear,
      experienceLevel: user.experienceLevel,
      targetCareer: user.targetCareer,
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editForm) return;
    setSavingEdit(true);
    try {
      const updated = await updateProfile(editForm);
      login(updated);
      setEditOpen(false);
      showToast('Profile updated.', 'success');
    } catch {
      showToast('Could not save your changes. Please try again.', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <Topbar title="My Profile" subtitle="Manage your personal and career information." />
      <h1 className="mb-6 text-xl font-bold lg:hidden">My Profile</h1>

      {/* Personal Info */}
      <Card className="mb-6 p-6">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar name={user.name} color={user.avatarColor} size={64} />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-ink-light dark:text-ink-dark">{user.name}</h2>
            <p className="text-sm text-muted-light dark:text-muted-dark">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-light dark:text-muted-dark">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {user.location}</span>
              <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {user.education} · {user.graduationYear}</span>
              <span className="flex items-center gap-1"><BriefcaseIcon className="h-3.5 w-3.5" /> {user.experienceLevel}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" icon={<Pencil className="h-3.5 w-3.5" />} onClick={openEdit}>Edit</Button>
        </div>
      </Card>

      {/* Career Goal */}
      <Card className="mb-6 p-6" accent="primary">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
            <Target className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-light dark:text-muted-dark">Career Goal</p>
            <p className="text-sm font-semibold text-ink-light dark:text-ink-dark">{user.targetCareer}</p>
          </div>
        </div>
      </Card>

      {/* Skills */}
      <Card className="mb-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Skills</h3>
          <Button size="sm" variant="outline" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setAddSkillOpen(true)}>Add Skill</Button>
        </div>
        <div className="space-y-2">
          {skills.map((s) => (
            <SkillCard key={s.name} skill={s} onRemove={removeSkill} />
          ))}
        </div>
      </Card>

      {/* Projects */}
      <Card className="mb-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Projects</h3>
          <Button size="sm" variant="outline" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setAddProjectOpen(true)}>Add Project</Button>
        </div>
        {projects.length === 0 ? (
          <p className="text-sm text-muted-light dark:text-muted-dark">No projects added yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((p) => (
              <div key={p.id} className="rounded-xl border border-border-light dark:border-border-dark p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-light dark:text-ink-dark">
                      {p.title}
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noreferrer" aria-label="Open project link">
                          <ExternalLink className="h-3.5 w-3.5 text-muted-light dark:text-muted-dark" />
                        </a>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-muted-light dark:text-muted-dark">{p.description}</p>
                  </div>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="shrink-0 rounded-lg p-1.5 text-muted-light hover:bg-danger-50 hover:text-danger-500 dark:text-muted-dark dark:hover:bg-danger-500/10"
                    aria-label={`Delete ${p.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {p.skills.map((s) => <Badge key={s} variant="neutral">{s}</Badge>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Experience */}
      <Card className="mb-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Experience</h3>
          <Button size="sm" variant="outline" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setAddExperienceOpen(true)}>Add Experience</Button>
        </div>
        {experience.length === 0 ? (
          <p className="text-sm text-muted-light dark:text-muted-dark">No experience added yet.</p>
        ) : (
          <div className="space-y-4">
            {experience.map((e) => (
              <div key={e.id} className="rounded-xl border border-border-light dark:border-border-dark p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-ink-light dark:text-ink-dark">{e.role}</p>
                    <p className="text-xs text-muted-light dark:text-muted-dark">{e.company} · {e.duration}</p>
                    <p className="mt-2 text-sm text-muted-light dark:text-muted-dark">{e.description}</p>
                  </div>
                  <button
                    onClick={() => deleteExperience(e.id)}
                    className="shrink-0 rounded-lg p-1.5 text-muted-light hover:bg-danger-50 hover:text-danger-500 dark:text-muted-dark dark:hover:bg-danger-500/10"
                    aria-label={`Delete ${e.role}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Certifications */}
      <Card className="mb-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Certifications</h3>
          <Button size="sm" variant="outline" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setAddCertOpen(true)}>Add Certification</Button>
        </div>
        {certifications.length === 0 ? (
          <p className="text-sm text-muted-light dark:text-muted-dark">No certifications added yet.</p>
        ) : (
          <div className="space-y-2">
            {certifications.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border-light dark:border-border-dark px-4 py-3">
                <Award className="h-4 w-4 shrink-0 text-primary-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink-light dark:text-ink-dark">{c.name}</p>
                  <p className="text-xs text-muted-light dark:text-muted-dark">{c.issuer} · {c.year}</p>
                </div>
                <button
                  onClick={() => deleteCertification(c.id)}
                  className="shrink-0 rounded-lg p-1.5 text-muted-light hover:bg-danger-50 hover:text-danger-500 dark:text-muted-dark dark:hover:bg-danger-500/10"
                  aria-label={`Delete ${c.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Career Interests */}
      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold">Career Interests</h3>
        <div className="flex flex-wrap gap-2">
          {interests.map((i) => <Badge key={i} variant="primary">{i}</Badge>)}
        </div>
      </Card>

      <Modal open={addSkillOpen} onClose={() => setAddSkillOpen(false)} title="Add a skill">
        <div className="space-y-4">
          <Input label="Skill name" placeholder="e.g. Kubernetes" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} />
          <Button fullWidth onClick={addSkill}>Add Skill</Button>
        </div>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit profile">
        {editForm && (
          <div className="space-y-4">
            <Input label="Full Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            <Input label="Location" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
            <Input label="Education" value={editForm.education} onChange={(e) => setEditForm({ ...editForm, education: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Graduation Year"
                type="number"
                value={editForm.graduationYear}
                onChange={(e) => setEditForm({ ...editForm, graduationYear: Number(e.target.value) })}
              />
              <Select
                label="Experience Level"
                value={editForm.experienceLevel}
                onChange={(e) => setEditForm({ ...editForm, experienceLevel: e.target.value as User['experienceLevel'] })}
              >
                {EXPERIENCE_LEVELS.map((lvl) => <option key={lvl}>{lvl}</option>)}
              </Select>
            </div>
            <Input label="Career Goal" value={editForm.targetCareer} onChange={(e) => setEditForm({ ...editForm, targetCareer: e.target.value })} />
            <Button fullWidth loading={savingEdit} onClick={saveEdit}>Save Changes</Button>
          </div>
        )}
      </Modal>

      <Modal open={addProjectOpen} onClose={() => setAddProjectOpen(false)} title="Add a project">
        <div className="space-y-4">
          <Input label="Title" placeholder="e.g. Personal Finance Tracker" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} />
          <Input label="Description" placeholder="What does it do?" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
          <Input label="Skills used" placeholder="e.g. React, Node.js, PostgreSQL" hint="Comma-separated" value={projectForm.skills} onChange={(e) => setProjectForm({ ...projectForm, skills: e.target.value })} />
          <Input label="Link (optional)" placeholder="https://github.com/..." value={projectForm.link} onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })} />
          <Button fullWidth loading={savingProject} onClick={saveProject}>Add Project</Button>
        </div>
      </Modal>

      <Modal open={addExperienceOpen} onClose={() => setAddExperienceOpen(false)} title="Add experience">
        <div className="space-y-4">
          <Input label="Role" placeholder="e.g. Backend Engineering Intern" value={experienceForm.role} onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })} />
          <Input label="Company" placeholder="e.g. Acme Corp" value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} />
          <Input label="Duration" placeholder="e.g. Jun 2025 - Aug 2025" value={experienceForm.duration} onChange={(e) => setExperienceForm({ ...experienceForm, duration: e.target.value })} />
          <Input label="Description" placeholder="What did you work on?" value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} />
          <Button fullWidth loading={savingExperience} onClick={saveExperience}>Add Experience</Button>
        </div>
      </Modal>

      <Modal open={addCertOpen} onClose={() => setAddCertOpen(false)} title="Add a certification">
        <div className="space-y-4">
          <Input label="Name" placeholder="e.g. AWS Certified Developer" value={certForm.name} onChange={(e) => setCertForm({ ...certForm, name: e.target.value })} />
          <Input label="Issuer" placeholder="e.g. Amazon Web Services" value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} />
          <Input label="Year" type="number" value={certForm.year} onChange={(e) => setCertForm({ ...certForm, year: e.target.value })} />
          <Button fullWidth loading={savingCert} onClick={saveCertification}>Add Certification</Button>
        </div>
      </Modal>
    </div>
  );
}
