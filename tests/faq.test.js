import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { remark } from 'remark';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import faqPlugin from '../plugins/faq.js';

const fixturePath = path.join(__dirname, 'fixtures', 'faqPlugin.md');
const md = fs.readFileSync(fixturePath, 'utf-8');

describe('FAQ Plugin', () => {
  it('extracts FAQ schema from markdown', async () => {
    const file = await remark().use(remarkDirective).use(faqPlugin).process(md);
    expect(file.data.astro.frontmatter.faqSchema).toBeDefined();
    expect(file.data.astro.frontmatter.faqSchema.mainEntity[0].name).toContain('This is a question');
  });

  it('uses default class when no config provided', async () => {
    const file = await remark()
      .use(remarkDirective)
      .use(faqPlugin) // no options
      .use(remarkRehype).use(rehypeStringify)
      .process(md);

    expect(String(file)).toContain('faq-block');
  });

  it('uses provided class from options', async () => {
    const file = await remark()
      .use(remarkDirective)
      .use(faqPlugin, { className: 'custom-class-here' })
      .use(remarkRehype).use(rehypeStringify)
      .process(md);

    expect(String(file)).toContain('custom-class-here');
  });

});

