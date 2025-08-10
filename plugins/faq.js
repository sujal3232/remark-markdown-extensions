import { visit } from 'unist-util-visit';

/**
 * FAQ plugin that:
 * - extracts H3 + following paragraph pairs as Q/A
 * - emits an outer <div> (className from options)
 * - sets node.data.hChildren to an array of hast <details> elements
 * - generates FAQPage schema into file.data.astro.frontmatter.faqSchema
 */
export default function faqPlugin(options = {}) {
  let { className = 'faq-block border border-gray-200 rounded-lg p-4 my-4 space-y-4' } = options;

  if (!className.includes('faq-block')) {
    className = 'faq-block ' + className;
  }

  return (tree, file) => {
    const faqItems = [];
    visit(tree, (node) => {
      if (node.type === 'containerDirective' && node.name === 'faq') {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.className = className; // outer div classes

        let currentQuestion = null;
        let currentAnswerNodes = []; // keep mdast nodes of the answer
        const detailsHast = [];

        node.children.forEach((child) => {
          if (child.type === 'heading' && child.depth === 3) {
            // flush previous Q/A
            if (currentQuestion && currentAnswerNodes.length) {
              const answerText = mdastNodesToPlainText(currentAnswerNodes);
              faqItems.push({ question: currentQuestion, answer: answerText.trim() });
              detailsHast.push(createFaqDetails(currentQuestion, answerText.trim()));
            }
            // start new Q
            currentQuestion = child.children.map((c) => c.value || '').join('');
            currentAnswerNodes = [];
          } else if (currentQuestion) {
            // gather everything after an H3 until next H3 as the answer
            currentAnswerNodes.push(child);
          }
        });

        // final flush
        if (currentQuestion && currentAnswerNodes.length) {
          const answerText = mdastNodesToPlainText(currentAnswerNodes);
          faqItems.push({ question: currentQuestion, answer: answerText.trim() });
          detailsHast.push(createFaqDetails(currentQuestion, answerText.trim()));
        }

        // Tell remark-rehype to render this node as a <div> with these hast children
        node.data.hName = 'div';
        node.data.hChildren = detailsHast;

        // Remove original mdast children so they are not processed again
        node.children = [];
      }
    });

    if (faqItems.length > 0) {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      };
      file.data.astro = file.data.astro || {};
      file.data.astro.frontmatter = file.data.astro.frontmatter || {};
      file.data.astro.frontmatter.faqSchema = schema;
    }
  };
}


function createFaqDetails(question, answer) {
  return {
    type: 'element',
    tagName: 'details',
    properties: { className: ['faq-item', 'mb-6'] },
    children: [
      {
        type: 'element',
        tagName: 'summary',
        properties: { className: ['cursor-pointer', 'font-semibold', 'text-2xl','lg:text-3xl','faq-q'] },
        children: [{ type: 'text', value: question }]
      },
      {
        type: 'element',
        tagName: 'div',
        properties: { className: [ 'text-lg', 'lg:text-xl', 'faq-a','p-4'] },
        children: [{ type: 'text', value: answer }]
      }
    ]
  };
}


function mdastNodesToPlainText(nodes) {
  return nodes
    .map((n) => {
      if (n.type === 'paragraph') {
        return (n.children || []).map((c) => c.value || '').join('');
      }
      if (n.type === 'text') return n.value || '';
      if (n.value) return n.value;
      // fallback: try to gather inline children
      if (n.children) return (n.children || []).map((c) => c.value || '').join('');
      return '';
    })
    .join('\n\n');
}
