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

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    type: z.string().default('astrolabe'),
    title: z.string(),
    description: z.string(),
    publish: z.coerce.date(),
    topics: z.array(z.string()).default([]),
    tags: z.array(z.string()).nullish().transform((t) => t ?? []),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
