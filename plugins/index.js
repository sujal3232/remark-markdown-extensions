// plugins/index.js
import asidePlugin from './aside.js';
import faqPlugin from './faq.js';

export const plugins = [
  { plugin: asidePlugin, options: { className: 'aside bg-gray-50 p-4' }, testData:{toContain:'<aside'} },
  { plugin: faqPlugin, options: { faqClass: 'faq-block' }, testData:{toContain:'faq-block'} },
  // Add new plugins here — they’ll be included automatically in tests
];

