---
title: "Server-Side Rendering"
letter: "S"
categories:
  - "improve-performance"
  - "explain-architecture"
  - "front-end-applications"
shortDefinition: "Generating the full HTML for a page on the server for each request, delivering ready-to-display content to the browser."
---

## Why does it exist?

Client-side rendered applications ship an empty HTML shell and rely on JavaScript to build the page in the browser. This means users see a blank screen until the JavaScript bundle downloads, parses, and executes. Search engine crawlers also struggle with content that only exists after JavaScript runs. Server-Side Rendering solves both problems by generating the complete HTML on the server, so the browser can display meaningful content immediately and crawlers can index it without executing JavaScript.

## Practical example of use

An online news publication uses Next.js with SSR for its article pages. When a reader clicks a link shared on social media, the Next.js server fetches the article content from the CMS, renders the full HTML including headline, body text, and metadata, and sends it to the browser. The reader sees the article text within milliseconds of the first byte arriving, even before any JavaScript loads. Social media platforms also get proper Open Graph tags for rich link previews because the meta tags are present in the initial HTML response.

```js
// Next.js page with server-side rendering
export async function getServerSideProps(context) {
  const { slug } = context.params;
  const article = await cms.getArticle(slug);

  return {
    props: { article },
  };
}

export default function ArticlePage({ article }) {
  return (
    <>
      <Head>
        <title>{article.title}</title>
        <meta property="og:title" content={article.title} />
        <meta property="og:image" content={article.heroImage} />
      </Head>
      <article>
        <h1>{article.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: article.body }} />
      </article>
    </>
  );
}
```

## When to use

- Content-heavy pages where SEO is critical, such as e-commerce product pages, blog posts, or documentation sites
- When the first meaningful paint must happen as fast as possible and content depends on dynamic, per-request data
- Pages where social media sharing and link previews require meta tags to be present in the initial HTML
- Applications serving users on slow networks or low-powered devices where large JavaScript bundles are a problem

## When to avoid

- Highly interactive dashboard-style applications where the content is behind authentication and SEO is irrelevant
- When your server infrastructure cannot handle the compute cost of rendering HTML for every request under high traffic
- Pages with content that is identical for all users and changes infrequently — Static Site Generation is a better choice

## Trade-offs

- **Faster first paint vs. server load**: Users see content sooner, but the server must render HTML for every request, increasing CPU usage and response times under load
- **SEO-friendly vs. increased complexity**: Full HTML is available for crawlers, but you now manage rendering logic on both server and client, dealing with environment differences (no window, no document on the server)
- **Better perceived performance vs. Time to Interactive gap**: The page appears loaded quickly, but it is not interactive until JavaScript hydrates — this can confuse users who click buttons that do not respond yet

## Common small mistakes

- Calling browser-only APIs (localStorage, window, document) in server-rendered code without guarding against their absence
- Not handling loading and error states on the server, leading to full-page error screens instead of graceful fallbacks
- Forgetting that SSR increases Time to First Byte because the server must fetch data and render HTML before responding
- Ignoring caching strategies — serving every request dynamically when many responses could be cached at the CDN or reverse proxy layer
