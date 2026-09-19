import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.array(z.enum(['Prototype', 'MVP', 'Stable', 'Ongoing', 'Study'])),
    year: z.string(),
    tagline: z.string(),
    stack: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { projects };
