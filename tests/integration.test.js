import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { remark } from 'remark';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import  { plugins }  from '../plugins/index.js';

describe('Integration: All Markdown Extensions Together', () => {
  const fixtureDir = path.join(__dirname, 'fixtures');

  // Combine all plugin fixture content
  const combinedMarkdown = plugins.map(({ plugin }) => {
    const name = plugin.name || 'unknown';
    const fixturePath = path.join(fixtureDir, `${name}.md`);
    if (fs.existsSync(fixturePath)) {
      return fs.readFileSync(fixturePath, 'utf-8');
    } else {
      console.warn(`⚠️ No fixture found for ${name}, skipping`);
      return '';
    }
  }).join('\n\n');

  it('runs all plugins together without conflict', async () => {
    const processor = remark().use(remarkDirective);
    plugins.forEach(({ plugin, options }) => {
      processor.use(plugin, options);
    });

    processor.use(remarkRehype).use(rehypeStringify);
    
    const file = await processor.process(combinedMarkdown);
    const output = String(file);
    
    // Check each plugin's output exists
    plugins.forEach(({ plugin }) => {
      const name = plugin.name || 'unknown';
      expect(output).toContain(name.split(/Plugin/i)[0] || name);
    });
  });

  it('runs all plugins together and they replace their content as expected', async () => {
    const processor = remark().use(remarkDirective);
    plugins.forEach(({ plugin, options }) => {
      processor.use(plugin, options);
    });

    processor.use(remarkRehype).use(rehypeStringify);
    
    const file = await processor.process(combinedMarkdown);
    const output = String(file);
    
    // Check each plugin's output exists
    plugins.forEach(({ plugin, testData }) => {
      const name = plugin.name || 'unknown';
      expect(output).toContain(testData.toContain);
    });
  });

});
