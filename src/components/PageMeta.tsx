import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://simulated.vision';
const SITE_NAME = 'Simulated Vision';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

interface PageMetaProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const PageMeta: React.FC<PageMetaProps> = ({ title, description, path, jsonLd }) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonical = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default PageMeta;
