import type { Listing } from "@/data/listings";
import { SITE_URL, site } from "./site";

export const organizationId = `${SITE_URL}/#organization`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: site.name,
    slogan: site.tagline,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-512.png`,
    telephone: site.phoneE164,
    address: { "@type": "PostalAddress", addressLocality: "Denpasar", addressRegion: "Bali", addressCountry: "ID" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phoneE164,
      contactType: "customer service",
      availableLanguage: ["id"],
    },
    sameAs: [site.social.facebook, site.social.instagram, site.social.tiktok],
  };
}

export function listingJsonLd(listing: Listing) {
  const url = `${SITE_URL}/listing/${listing.slug}`;
  const address = {
    "@type": "PostalAddress",
    addressLocality: `${listing.area.district}, ${listing.area.subdistrict}`,
    addressRegion: listing.area.province,
    addressCountry: "ID",
  };
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    name: listing.title,
    description: listing.summary,
    url,
    datePosted: listing.source.datePosted,
    image: [`${SITE_URL}/og.png`],
    provider: { "@id": organizationId },
    offers: listing.types.map((type) => ({
      "@type": "Offer",
      name: type.name,
      price: type.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/PreOrder",
      seller: { "@id": organizationId },
      itemOffered: {
        "@type": "SingleFamilyResidence",
        name: `${type.name}, ${listing.shortTitle}`,
        floorSize: { "@type": "QuantitativeValue", value: type.buildingArea, unitCode: "MTK" },
        additionalProperty: [{ "@type": "PropertyValue", name: "Luas tanah", value: type.landArea, unitCode: "MTK" }],
        address,
      },
    })),
  };
}
