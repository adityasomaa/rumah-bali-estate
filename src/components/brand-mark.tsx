import { useId } from "react";

/** Ikon rumah Rumah Bali Estate, digambar ulang sebagai vektor dari logo di profil Facebook/Instagram. */
export function BrandMark({ className, tone = "brand" }: { className?: string; tone?: "brand" | "current" }) {
  const gradientId = useId();
  const stroke = tone === "brand" ? `url(#${gradientId})` : "currentColor";
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      {tone === "brand" ? (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2aa64f" />
            <stop offset="1" stopColor="#17753a" />
          </linearGradient>
        </defs>
      ) : null}
      <path d="M6.5 43.5V20.5L24 6.5l17.5 14v23" fill="none" stroke={stroke} strokeWidth="5" strokeMiterlimit="10" pathLength={1} className="mark-roof" />
      <path d="M16.5 43.5v-12L24 25.5l7.5 6v12" fill="none" stroke={stroke} strokeWidth="4" strokeMiterlimit="10" pathLength={1} className="mark-wall" />
      <path d="M4 43.5h40" stroke={stroke} strokeWidth="5" />
    </svg>
  );
}
