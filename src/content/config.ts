import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      role: z.string(),
      techStack: z.array(z.string()),
      description: z.string(),
      image: z.optional(image()),
      tags: z.array(z.string()).optional(),
      pubDate: z.coerce.date().optional(),
    }),
})

export const collections = {
  projects: projectsCollection,
}
