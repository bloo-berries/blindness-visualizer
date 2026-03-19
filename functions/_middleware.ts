/**
 * Cloudflare Pages middleware that intercepts crawler requests and injects
 * proper SEO meta tags into the HTML response.
 *
 * 1. Social crawlers on /famous-people?person=X  →  person-specific OG tags
 * 2. Search engine crawlers on any route  →  route-specific title, description, canonical
 * 3. All other requests  →  pass through unchanged
 */

interface PersonMeta {
  name: string;
  condition: string;
  years: string;
  achievement: string;
}

type MetadataMap = Record<string, PersonMeta>;

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

/** Social-media crawlers (need OG/Twitter cards) */
const SOCIAL_CRAWLER_PATTERN =
  /facebookexternalhit|Facebookbot|Twitterbot|LinkedInBot|Slackbot|WhatsApp|TelegramBot|Discordbot|Applebot|Pinterestbot/i;

/** Search-engine crawlers (need correct title/description/canonical) */
const SEARCH_ENGINE_PATTERN = /Googlebot|bingbot|YandexBot|DuckDuckBot|Baiduspider/i;

const BASE_URL = 'https://theblind.spot';
const SITE_NAME = 'The Blind Spot';

/** Route-specific meta for search engine pre-rendering */
const ROUTE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: SITE_NAME,
    description: 'Free online vision simulator — experience 148+ conditions including color blindness, macular degeneration, and glaucoma. Profiles 214+ famous people with visual impairments.',
  },
  '/simulator': {
    title: `Live Vision Simulator | ${SITE_NAME}`,
    description: 'Simulate vision conditions in real-time on video or images. Experience color blindness, macular degeneration, glaucoma, and more through interactive visualization.',
  },
  '/famous-people': {
    title: `Famous People with Vision Conditions | ${SITE_NAME}`,
    description: 'Explore famous historical and contemporary figures who lived with vision conditions. Experience their visual impairments through interactive simulations.',
  },
  '/conditions': {
    title: `Vision Conditions Glossary | ${SITE_NAME}`,
    description: 'Comprehensive glossary of 148+ vision conditions with descriptions, symptoms, causes, and treatments.',
  },
  '/faq': {
    title: `Frequently Asked Questions | ${SITE_NAME}`,
    description: 'Find answers to common questions about blindness, visual impairment, and accessibility.',
  },
  '/about': {
    title: `About | ${SITE_NAME}`,
    description: 'Learn about The Blind Spot, an educational tool that simulates vision conditions to build empathy and understanding of visual impairments.',
  },
  '/resources': {
    title: `Resources | ${SITE_NAME}`,
    description: 'Helpful resources for understanding and supporting people with visual impairments.',
  },
  '/feedback': {
    title: `Feedback | ${SITE_NAME}`,
    description: 'Share your feedback about The Blind Spot vision condition simulator.',
  },
};

let metadataCache: MetadataMap | null = null;

async function loadMetadata(env: Env): Promise<MetadataMap | null> {
  if (metadataCache) return metadataCache;

  try {
    const metaReq = new Request(`${BASE_URL}/og/metadata.json`);
    const metaRes = await env.ASSETS.fetch(metaReq);
    if (!metaRes.ok) return null;
    metadataCache = (await metaRes.json()) as MetadataMap;
    return metadataCache;
  } catch {
    return null;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildPersonOgTags(personId: string, person: PersonMeta): string {
  const title = `${person.name} — ${person.condition} | ${SITE_NAME}`;
  const description = person.achievement
    ? `Learn about ${person.name}'s vision condition: ${person.condition}. ${person.achievement}`
    : `Learn about ${person.name}'s vision condition: ${person.condition}.`;
  const url = `${BASE_URL}/famous-people?person=${personId}`;
  const image = `${BASE_URL}/og/${personId}.png`;

  return `
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />`;
}

async function fetchIndexHtml(env: Env): Promise<string | null> {
  try {
    const indexReq = new Request(`${BASE_URL}/index.html`);
    const indexRes = await env.ASSETS.fetch(indexReq);
    if (!indexRes.ok) return null;
    return indexRes.text();
  } catch {
    return null;
  }
}

function injectMetaIntoHtml(
  html: string,
  title: string,
  description: string,
  canonical: string,
  extraTags?: string
): string {
  let result = html;

  // Replace <title>
  result = result.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);

  // Inject description + canonical + any extra tags before </head>
  const injected = `
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />${extraTags || ''}`;
  result = result.replace('</head>', `${injected}\n  </head>`);

  return result;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const ua = request.headers.get('user-agent') || '';

  const isSocialCrawler = SOCIAL_CRAWLER_PATTERN.test(ua);
  const isSearchEngine = SEARCH_ENGINE_PATTERN.test(ua);

  // 1. Social crawlers on /famous-people?person=X → person-specific OG tags
  if (
    isSocialCrawler &&
    url.pathname === '/famous-people' &&
    url.searchParams.has('person')
  ) {
    const personId = url.searchParams.get('person')!;
    const metadata = await loadMetadata(env);
    if (metadata && metadata[personId]) {
      const person = metadata[personId];
      const html = await fetchIndexHtml(env);
      if (html) {
        const title = `${person.name} — ${person.condition} | ${SITE_NAME}`;
        const description = person.achievement
          ? `Learn about ${person.name}'s vision condition: ${person.condition}. ${person.achievement}`
          : `Learn about ${person.name}'s vision condition: ${person.condition}.`;
        const canonical = `${BASE_URL}/famous-people?person=${personId}`;
        const ogTags = buildPersonOgTags(personId, person);
        const result = injectMetaIntoHtml(html, title, description, canonical, ogTags);

        return new Response(result, {
          status: 200,
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'public, max-age=3600',
          },
        });
      }
    }
  }

  // 1b. Social crawlers on /simulator?preset=X → preset-specific OG tags
  if (
    isSocialCrawler &&
    url.pathname === '/simulator' &&
    url.searchParams.has('preset')
  ) {
    const presetParam = url.searchParams.get('preset')!;
    let conditionNames: string[] = [];
    try {
      const decoded = JSON.parse(atob(presetParam));
      if (decoded.c && Array.isArray(decoded.c)) {
        conditionNames = decoded.c.map((c: { id: string }) =>
          c.id.replace(/([A-Z])/g, ' $1').replace(/^./, (s: string) => s.toUpperCase()).trim()
        );
      }
    } catch {
      // Invalid preset, fall through
    }

    if (conditionNames.length > 0) {
      const html = await fetchIndexHtml(env);
      if (html) {
        const conditionsStr = conditionNames.slice(0, 3).join(', ') + (conditionNames.length > 3 ? ` +${conditionNames.length - 3} more` : '');
        const title = `See Through My Eyes — ${conditionsStr} | ${SITE_NAME}`;
        const description = `Experience what vision looks like with ${conditionsStr}. Try the free interactive simulator.`;
        const canonical = `${BASE_URL}/simulator?preset=${presetParam}`;
        const image = `${BASE_URL}/og/preset-share.png`;
        const ogTags = `
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />`;
        const result = injectMetaIntoHtml(html, title, description, canonical, ogTags);

        return new Response(result, {
          status: 200,
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'public, max-age=3600',
          },
        });
      }
    }
  }

  // 2. Search engine crawlers on any known route → route-specific meta
  if (isSearchEngine) {
    const routeMeta = ROUTE_META[url.pathname];
    if (routeMeta) {
      const html = await fetchIndexHtml(env);
      if (html) {
        const canonical = `${BASE_URL}${url.pathname}`;
        const result = injectMetaIntoHtml(html, routeMeta.title, routeMeta.description, canonical);

        return new Response(result, {
          status: 200,
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'public, max-age=3600',
          },
        });
      }
    }
  }

  // 3. Everything else → pass through
  return context.next();
};
