import { visit } from 'unist-util-visit';

export default function faqPlugin(options = {}) {
  const { className = 'faq-block border border-gray-200 rounded-lg p-4 my-4 space-y-4' } = options;

  return (tree, file) => {
    const faqItems = [];

    visit(tree, (node) => {
      if (node.type === 'containerDirective' && node.name === 'faq') {
        node.data = node.data || {};
        node.data.hName = 'div';
        node.data.hProperties = {
          class: className
        };

        let currentQuestion = null;
        let currentAnswer = '';

        node.children.forEach((child) => {
          if (child.type === 'heading' && child.depth === 3) {
            if (currentQuestion && currentAnswer) {
              faqItems.push({ question: currentQuestion, answer: currentAnswer.trim() });
            }
            currentQuestion = child.children.map((c) => c.value || '').join('');
            currentAnswer = '';
          } else if (currentQuestion) {
            currentAnswer +=
              (child.value || child.children?.map((c) => c.value || '').join('') || '') + '\n';
          }
        });

        if (currentQuestion && currentAnswer) {
          faqItems.push({ question: currentQuestion, answer: currentAnswer.trim() });
        }
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

      file.data.astro.frontmatter.faqSchema = schema;
    }
  };
}
