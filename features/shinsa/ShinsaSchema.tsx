import type { ShinsaData } from './types';

type Props = {
  data: ShinsaData[]
}

export default function ShinsaSchema({ data }: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return (
    <>
      {data.map((shinsa) => {
        if (!shinsa.startAt) return null;

        const { kyudojo } = shinsa;


        let locationSchema = {
          "@type": "Place",
          "name": shinsa.location,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "",
            "addressCountry": "JP"
          }
        };
        if (kyudojo !== null) {
          const kyudojoCoordinate = (kyudojo.latitude && kyudojo.longitude) ? {
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": kyudojo.latitude,
                "longitude": kyudojo.longitude
              }
            } : {};

          locationSchema = {
            "@type": "Place",
            "name": kyudojo.name,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": kyudojo.address || "",
              "addressCountry": "JP"
            },
            ...kyudojoCoordinate
          }
        }

        const eventJson = {
          "@context": "https://schema.org",
          "@type": "Event",
          "name": shinsa.name,
          "startDate": shinsa.startAt,
          "description": shinsa.note || "日本弓道結構化審查情報",
          "eventAttendanceMode": "https://schema.org",
          "eventStatus": "https://schema.org",
          "location": locationSchema,
          "url": `${siteUrl}`
        };

        return (
          <script
            key={`schema-${shinsa.id}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJson) }}
          />
        );
      })}
    </>
  );
}
