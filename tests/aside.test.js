import { describe, it, expect } from 'vitest';
import remark from 'remark';
import remarkDirective from 'remark-directive';
import html from 'remark-html';
import asidePlugin from '../plugins/aside.js';

const fixturePath = path.join(__dirname, 'fixtures', 'aside.md');
const md = fs.readFileSync(fixturePath, 'utf-8');

describe('Aside Plugin', () => {
  it('uses default class when no config provided', async () => {
    const file = await remark()
      .use(remarkDirective)
      .use(asidePlugin) // no options
      .use(html)
      .process(md);

    expect(String(file)).toContain('aside-block');
  });

  it('uses provided class from options', async () => {
    const file = await remark()
      .use(remarkDirective)
      .use(asidePlugin, { className: 'custom-class-here' })
      .use(html)
      .process(md);

    expect(String(file)).toContain('custom-class-here');
  });

  it('renders aside blocks with proper HTML and classes', async () => {
    const file = await remark()
      .use(remarkDirective)
      .use(asidePlugin)
      .use(html)
      .process(md);

    const htmlOutput = String(file);

    expect(htmlOutput).toContain('<aside');
    expect(htmlOutput).toContain('aside-block');
    expect(htmlOutput).toContain('This is an aside note with extra context.');
  });

});
