# Remark Markdown Extensions

These plugins extend the base markdown functionality. 

On astro sites, they must be added to `astro.config.mjs` as follows:

```javascript
import { asidePlugin } from 'remark-markdown-extensions';
import { faqPlugin } from 'remark-markdown-extensions';
//etc...

export default {
  markdown: {
    remarkPlugins: [
      [asidePlugin, { className: 'aside my-custom-aside' }],
      [faqPlugin, { className: 'faq-block' }],
      //etc...
    ]
  }
};
```

## faqPlugin

use in markdown

```markdown
# Document with FAQ

:::faq
### This is a question
And this is an answer.
### This is another question
And this is another answer.
:::

```

### Structured Data

Additionally, the **faqPlugin** adds `{postobject}.data.frontmatter.faqSchema` to the content entry which provides a structured data object for a FAQ.

```javascript
import { render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }));
}
type Props = CollectionEntry<'blog'>;
const post = Astro.props;
const { Content } = await render(post);

//post.data.frontmatter.faqSchema will be set, and can be used to print structured data

```

you could pass this along as a prop to the template that generates your html->head content like:

```javascript
<BaseHead structured_data={post.data.frontmatter.faqSchema}/>
```

and then use it in that template like:

```javascript
{structured_data && <script type="application/ld+json" set:html={JSON.stringify(structured_data)}></script>}

```

if your post already has existing structured data, you can create an array with both and use that the same way as a single structured data object

```javascript
const structured_data_array = [existing_structured_data, post.data.frontmatter.faqSchema];
<BaseHead structured_data={structured_data_array}/>
```

as valid structured data may be a single object or array of structured data objects.

## asidePlugin

```markdown

# Document with Aside

:::aside
## Aside Header
Custom aside content.
:::
```
