import { describe, it, expect } from 'vitest';
import remark from 'remark';
import remarkDirective from 'remark-directive';
import faqPlugin from '../plugins/faq.js';

const fixturePath = path.join(__dirname, 'fixtures', 'faq.md');
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
      .use(html)
      .process(md);

    expect(String(file)).toContain('aside-block');
  });

  it('uses provided class from options', async () => {
    const file = await remark()
      .use(remarkDirective)
      .use(faqPlugin, { className: 'custom-class-here' })
      .use(html)
      .process(md);

    expect(String(file)).toContain('custom-class-here');
  });

});

