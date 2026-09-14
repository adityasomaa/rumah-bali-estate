import type { HouseType } from "@/data/listings";
import { formatArea, formatRupiahShort } from "./format";

// Selisih selalu dihitung dari data listing, tidak pernah ditulis manual.
export function compareTypes(a: HouseType, b: HouseType) {
  return {
    price: b.price - a.price,
    landArea: b.landArea - a.landArea,
    buildingArea: b.buildingArea - a.buildingArea,
  };
}

const MINUS = "−";

export function signedRupiah(value: number) {
  if (value === 0) return "Sama";
  return `${value > 0 ? "+" : MINUS}${formatRupiahShort(value)}`;
}

export function signedArea(value: number) {
  if (value === 0) return "Sama";
  return `${value > 0 ? "+" : MINUS}${formatArea(Math.abs(value))}`;
}

/** Kalimat ringkas untuk aria-live dan ringkasan visual. */
export function describeComparison(a: HouseType, b: HouseType) {
  const d = compareTypes(a, b);
  const parts: string[] = [];
  if (d.price === 0) parts.push(`harganya sama`);
  else parts.push(`${d.price > 0 ? "lebih mahal" : "lebih murah"} ${formatRupiahShort(d.price)}`);
  if (d.landArea === 0) parts.push("luas tanahnya sama");
  else parts.push(`luas tanahnya ${formatArea(Math.abs(d.landArea))} ${d.landArea > 0 ? "lebih luas" : "lebih sempit"}`);
  const building =
    d.buildingArea === 0
      ? "Luas bangunan sama."
      : `Luas bangunan ${d.buildingArea > 0 ? "lebih luas" : "lebih sempit"} ${formatArea(Math.abs(d.buildingArea))}.`;
  return `${b.name} ${parts.join(" dan ")} dibanding ${a.name}. ${building}`;
}
