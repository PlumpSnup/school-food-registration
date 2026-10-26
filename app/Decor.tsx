// Hand-drawn style decorations: wavy section edges, twirly lines and outline doodles.

type Props = { className?: string };

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Wavy top edge for a section; its colour comes from the section via currentColor. */
export function Wave({ className = "" }: Props) {
  return (
    <svg className={`wave ${className}`} viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M0 46 C 160 6 300 6 460 34 S 760 78 940 44 S 1260 4 1440 36 L 1440 80 L 0 80 Z"
      />
    </svg>
  );
}

/** A ribbon-like line with a loop in it, like a twirl of honey. */
export function Twirl({ className = "" }: Props) {
  return (
    <svg className={`twirl ${className}`} viewBox="0 0 600 160" aria-hidden="true">
      <path
        d="M4 120 C 80 40 160 150 250 96 C 300 66 320 20 290 14 C 258 8 250 60 290 80 C 340 106 420 40 470 70 C 520 100 560 60 596 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LeafIcon({ className = "" }: Props) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path {...line} d="M10 38C8 22 18 10 38 10c1 18-10 29-28 28z" />
      <path {...line} d="M10 38 28 20M18 30h7M22 26v-6" />
    </svg>
  );
}

export function HeartIcon({ className = "" }: Props) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path {...line} d="M24 39S8 29 8 18c0-5 4-8 8-8 3.5 0 6 2 8 5 2-3 4.5-5 8-5 4 0 8 3 8 8 0 11-16 21-16 21z" />
    </svg>
  );
}

export function PhoneIcon({ className = "" }: Props) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <rect {...line} x="14" y="6" width="20" height="36" rx="5" />
      <path {...line} d="M21 36h6M19 16h10M19 22h10M19 28h6" />
    </svg>
  );
}

export function PotIcon({ className = "" }: Props) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path {...line} d="M9 22h30v8c0 6-5 10-11 10h-8c-6 0-11-4-11-10v-8zM5 22h4M39 22h4M20 22c0-3 1.5-5 4-5s4 2 4 5" />
      <path {...line} d="M18 12c0-2 2-2 2-4M24 12c0-2 2-2 2-4M30 12c0-2 2-2 2-4" />
    </svg>
  );
}

export function SchoolIcon({ className = "" }: Props) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path {...line} d="M8 40V20l16-10 16 10v20H8zM20 40v-9h8v9M24 10V4l6 2-6 2" />
      <circle {...line} cx="24" cy="21" r="3" />
    </svg>
  );
}

export function StarIcon({ className = "" }: Props) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path {...line} d="m24 7 5 10.5 11.5 1.5-8.5 8 2 11.5L24 33l-10 5.5 2-11.5-8.5-8L19 17.5z" />
    </svg>
  );
}

/** Faint food doodles scattered behind a section, like the pattern on a paper bag. */
const DOODLES = ["drumstick", "carrot", "rice", "cucumber", "water", "carrot"];

export function Doodles({ className = "" }: Props) {
  return (
    <div className={`doodles ${className}`} aria-hidden="true">
      {DOODLES.map((name, i) => (
        <img key={i} src={`/doodles/${name}.png`} alt="" className={`doodle d${i + 1}`} />
      ))}
    </div>
  );
}
