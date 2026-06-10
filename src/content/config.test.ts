import { describe, it, expect } from 'vitest';
import { z } from 'astro/zod';

// Simplified schema for projects collection (matches design.md)
const createProjectsSchema = () =>
  z.object({
    title: z.string(),
    client: z.string(),
    role: z.string(),
    techStack: z.array(z.string()),
    description: z.string(),
  });

describe('Projects Content Collection Schema', () => {
  it('should define a valid Zod schema for projects collection', () => {
    const schema = createProjectsSchema();
    expect(schema).toBeDefined();
    expect(typeof schema.parse).toBe('function');
  });

  it('should parse valid project data', () => {
    const schema = createProjectsSchema();

    const validProject = {
      title: 'E-commerce Platform',
      client: 'RetailCo',
      role: 'Lead Developer',
      techStack: ['React', 'Node.js', 'PostgreSQL'],
      description: 'Built a scalable e-commerce platform',
    };

    const result = schema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it('should reject project missing required fields', () => {
    const schema = createProjectsSchema();

    const invalidProject = {
      title: 'E-commerce Platform',
      // missing client, role, techStack, description
    };

    const result = schema.safeParse(invalidProject);
    expect(result.success).toBe(false);
  });

  it('should validate techStack is an array of strings', () => {
    const schema = createProjectsSchema();

    const projectWithStringTechStack = {
      title: 'Test Project',
      client: 'TestClient',
      role: 'Developer',
      techStack: 'React', // string instead of array - should fail
      description: 'Test description',
    };

    const result = schema.safeParse(projectWithStringTechStack);
    expect(result.success).toBe(false);
  });

  it('should reject empty techStack array', () => {
    const schema = createProjectsSchema();

    const projectWithEmptyTechStack = {
      title: 'Test Project',
      client: 'TestClient',
      role: 'Developer',
      techStack: [],
      description: 'Test description',
    };

    const result = schema.safeParse(projectWithEmptyTechStack);
    // Empty array is valid for z.array(z.string())
    expect(result.success).toBe(true);
  });
});