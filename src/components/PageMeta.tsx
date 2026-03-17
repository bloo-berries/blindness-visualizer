import { Helmet } from 'react-helmet-async';

export const BASE_URL = 'https://theblind.spot';
export const SITE_NAME = 'The Blind Spot';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

interface PageMetaProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const PageMeta: React.FC<PageMetaProps> = ({ title, description, path, ogImage, jsonLd }) => {
  const fullTitle = path === '/' ? SITE_NAME : `${title} | ${SITE_NAME}`;
  const canonical = `${BASE_URL}${path}`;
  const image = ogImage || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default PageMeta;
