import { visit } from 'unist-util-visit';

export default function asidePlugin(options = {}) {
  const { className = 'aside-block p-4 border-l-4 border-blue-500' } = options;
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective' && node.name === 'aside') {
        node.data = node.data || {};
        node.data.hName = 'aside';
        node.data.hProperties = {
          class: className
        };
      }
    });
  };
}
