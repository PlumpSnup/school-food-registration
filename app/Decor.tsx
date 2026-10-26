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

// Outline versions of the lunchbox food drawings, used as background doodles.
export function DrumstickIcon({ className = "" }: Props) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path {...line} d="M20 29c-5-7-3-20 8-22 10-1 15 7 12 15-3 7-12 10-20 7z" />
      <path {...line} d="M27 13c3-2 7-1 9 2" />
      <path {...line} d="M19 27l-5 5M22 31l-5 5" />
      <path {...line} d="M14 32a3.2 3.2 0 1 0-3 4.5 3.2 3.2 0 1 0 6-.5" />
    </svg>
  );
}

export function RiceBowlIcon({ className = "" }: Props) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path {...line} d="M7 24h34c0 9-7 15-17 15S7 33 7 24z" />
      <path {...line} d="M19 39v3h10v-3" />
      <path {...line} d="M10 24c-1-5 3-9 7-8 1-4 7-6 10-3 3-2 8 0 9 4 3 0 5 4 3 7" />
      <path {...line} d="M18 20l1 1M24 18l1 1M29 21l1-1M22 22h1" />
    </svg>
  );
}

export function CucumberIcon({ className = "" }: Props) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path {...line} d="M24 13a10 10 0 1 1 12 15" />
      <path {...line} d="M31 13.5l.5 2M36 19l-2 .5M34 24.5l-1.5-1" />
      <circle {...line} cx="18" cy="29" r="11" />
      <circle {...line} cx="18" cy="29" r="7.5" />
      <path {...line} d="M18 26v-2M20.9 28.1l1.9-.6M19.8 31.4l1.2 1.6M16.2 31.4 15 33M15.1 28.1l-1.9-.6" />
    </svg>
  );
}

export function CarrotIcon({ className = "" }: Props) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path {...line} d="M29 16c4 1 6 6 3 10L15 42c-2 2-6 0-5-3l10-19c2-4 6-5 9-4z" />
      <path {...line} d="M19 28l4 2M15 35l3 1.5M24 22l3 1.5" />
      <path {...line} d="M30 16c-2-4-1-9 2-9 3 0 3 5 0 9" />
      <path {...line} d="M31 17c2-4 7-6 9-3 1 3-4 5-8 4" />
      <path {...line} d="M32 17c4-1 8 1 7 4-1 2-5 1-7-2" />
    </svg>
  );
}

export function WaterGlassIcon({ className = "" }: Props) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path {...line} d="M11 7h26l-3 33c0 1-1 2-2 2H16c-1 0-2-1-2-2z" />
      <path {...line} d="M12.5 20c4-3 7 1 11.5-1s7.5-2 11.5 1" />
      <path {...line} d="M17 26v8" />
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

/** Faint outline doodles scattered behind a section, like the pattern on a paper bag. */
export function Doodles({ className = "" }: Props) {
  return (
    <div className={`doodles ${className}`} aria-hidden="true">
      <DrumstickIcon className="doodle d1" />
      <CarrotIcon className="doodle d2" />
      <RiceBowlIcon className="doodle d3" />
      <CucumberIcon className="doodle d4" />
      <WaterGlassIcon className="doodle d5" />
      <CarrotIcon className="doodle d6" />
    </div>
  );
}
