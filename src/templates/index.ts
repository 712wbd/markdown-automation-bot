import { TemplateConfig } from '@/types';
import { githubTemplates } from './github';
import { documentationTemplates } from './documentation';
import { learningTemplates } from './learning';
import { businessTemplates } from './business';

export const allTemplates: TemplateConfig[] = [
  ...githubTemplates,
  ...documentationTemplates,
  ...learningTemplates,
  ...businessTemplates,
];

export * from './github';
export * from './documentation';
export * from './learning';
export * from './business';

export function getTemplateById(id: string): TemplateConfig | undefined {
  return allTemplates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: string): TemplateConfig[] {
  return allTemplates.filter(t => t.category === category);
}

export function getTemplatesByTags(tags: string[]): TemplateConfig[] {
  return allTemplates.filter(t => 
    tags.some(tag => t.tags.includes(tag))
  );
}
