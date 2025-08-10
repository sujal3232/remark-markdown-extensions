import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { remark } from 'remark';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import asidePlugin from '../plugins/aside.js';
import faqPlugin from '../plugins/faq.js';

describe('Integration: Combined Plugins', () => {
  const asideFixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'asidePlugin.md'), 'utf-8');
  const faqFixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'faqPlugin.md'), 'utf-8');
  const combinedMarkdown = asideFixture + '\n\n' + faqFixture;
  it('renders both plugins correctly together', async () => {
    const processor = remark().use(remarkDirective);
    
    processor.use(asidePlugin, { className: 'aside p-4' });
    processor.use(faqPlugin, { faqClass: 'faq-block' });

    processor.use(remarkRehype).use(rehypeStringify);

    const file = await processor.process(combinedMarkdown);
    const output = String(file);

    expect(output).toContain('<aside');
    expect(output).toContain('faq-block');
  });
});
