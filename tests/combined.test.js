import { describe, it, expect } from 'vitest';
import remark from 'remark';
import remarkDirective from 'remark-directive';
import html from 'remark-html';
import asidePlugin from '../plugins/aside.js';
import faqPlugin from '../plugins/faq.js';
import fs from 'node:fs';
import path from 'node:path';

describe('Integration: Combined Plugins', () => {
  const asideFixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'aside.md'), 'utf-8');
  const faqFixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'faq.md'), 'utf-8');
  const combinedMarkdown = asideFixture + '\n\n' + faqFixture;

  it('renders both plugins correctly together', async () => {
    const file = await remark()
      .use(remarkDirective)
      .use(asidePlugin, { className: 'aside p-4' })
      .use(faqPlugin, { faqClass: 'faq-block' })
      .use(html)
      .process(combinedMarkdown);

    const output = String(file);

    expect(output).toContain('<aside');
    expect(output).toContain('faq-block');
  });
});
