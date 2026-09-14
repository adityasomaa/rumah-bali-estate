import { listings, type HouseType, type Listing } from "./listings";
import { formatRupiahShort } from "@/lib/format";

export type TypeOption = { value: string; label: string; hint: string; type: HouseType; listing: Listing };

/** Semua tipe dari semua listing, untuk dropdown form dan simulasi KPR. */
export const typeOptions: TypeOption[] = listings.flatMap((listing) =>
  listing.types.map((type) => ({
    value: `${listing.slug}:${type.id}`,
    label: `${type.name}, ${listing.area.district}`,
    hint: formatRupiahShort(type.price),
    type,
    listing,
  })),
);

export function findTypeOption(value: string | null | undefined) {
  return typeOptions.find((option) => option.value === value) ?? null;
}

/** Headline & deskripsi perbandingan dibentuk dari data, bukan ditulis manual. */
export function comparisonCopy(listing: Listing) {
  const [a, b] = listing.types;
  const sameBuilding = listing.types.every((t) => t.buildingArea === a.buildingArea);
  const names = listing.types.map((t) => t.name).join(" dan ");
  return {
    sameBuilding,
    names,
    title: sameBuilding ? `Dua tipe, luas bangunan sama` : `Bandingkan ${names}`,
    description: sameBuilding && b
      ? `${names} sama-sama memiliki luas bangunan ${a.buildingArea} m². Perbedaannya ada di luas tanah dan harga.`
      : `Bandingkan harga, luas bangunan, dan luas tanah setiap tipe.`,
  };
}
