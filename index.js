import faqPlugin from './plugins/faq.js';
import asidePlugin from './plugins/aside.js';

export { faqPlugin, asidePlugin };

export default function remarkMarkdownExtensions() {
  return [faqPlugin, asidePlugin];
}

