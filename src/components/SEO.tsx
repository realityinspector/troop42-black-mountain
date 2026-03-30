import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const DEFAULT_DESCRIPTION =
  'Troop 42 Black Mountain is a Scouts BSA troop dedicated to building character, citizenship, and outdoor skills through adventure and service in the Black Mountain community.';

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = '/og-image.png',
  url,
  type = 'website',
}: SEOProps) {
  const fullTitle = title
    ? `${title} | Troop 42 Black Mountain`
    : 'Troop 42 Black Mountain - Scouts BSA';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content={type} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
