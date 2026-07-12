import ModernATS from './ModernATS';
import CreativeResume from './CreativeResume';
import ExecutiveResume from './ExecutiveResume';
import MinimalResume from './MinimalResume';

export const RESUME_TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean, traditional single-column layout',
    accentColor: '#5B6472',
    component: ModernATS,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Two-column layout with sidebar and accent color',
    accentColor: '#6366F1',
    component: CreativeResume,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Bold headings with a polished, senior-level feel',
    accentColor: '#2F9E6E',
    component: ExecutiveResume,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Understated, typography-first design',
    accentColor: '#14171F',
    component: MinimalResume,
  },
];

export function getTemplateById(id) {
  return RESUME_TEMPLATES.find((t) => t.id === id) || RESUME_TEMPLATES[0];
}
