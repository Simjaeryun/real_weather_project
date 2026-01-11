/**
 * JSON-LD Structured Data 컴포넌트
 * SEO를 위한 구조화된 데이터를 제공합니다.
 */
export function JsonLd<T extends Record<string, unknown>>({
  data,
}: {
  data: T;
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Real Weather",
        description: "실시간 날씨 정보 제공 서비스",
        url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/weather?name={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

interface WeatherJsonLdProps {
  location: string;
  temperature?: number;
  humidity?: number;
  lat: number;
  lon: number;
}

export function WeatherJsonLd({
  location,
  temperature,
  humidity,
  lat,
  lon,
}: WeatherJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Place",
        name: location,
        geo: {
          "@type": "GeoCoordinates",
          latitude: lat,
          longitude: lon,
        },
        ...(temperature !== undefined && {
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "temperature",
              value: temperature,
              unitText: "CEL",
            },
            ...(humidity !== undefined
              ? [
                  {
                    "@type": "PropertyValue",
                    name: "humidity",
                    value: humidity,
                    unitText: "P1",
                  },
                ]
              : []),
          ],
        }),
      }}
    />
  );
}
