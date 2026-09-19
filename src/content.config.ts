import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.enum(['Prototype', 'MVP', 'Stable', 'Ongoing', 'Study'])),
    year: z.string(),
    tagline: z.string(),
    stack: z.string().optional(),
    order: z.number().optional(),
    github: z.string().url().optional(),
    forgejo: z.string().url().optional(),
  }),
});

export const collections = { projects };
