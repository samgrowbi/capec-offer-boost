/**
 * Abstract inventory/growth motif. Pure SVG, no raster assets.
 * Stacked pallet units with a capital line running through them.
 */
export function InventoryMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 260"
      className={className}
      role="img"
      aria-label="Abstract illustration of stacked inventory units with a rising capital line"
      fill="none"
    >
      <defs>
        <linearGradient id="capec-fade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.20" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* baseline grid */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="8"
          x2="412"
          y1={70 + i * 56}
          y2={70 + i * 56}
          stroke="currentColor"
          strokeOpacity="0.10"
          strokeWidth="1"
        />
      ))}

      {/* inventory units, growing in stack height */}
      {[
        { x: 40, units: 1 },
        { x: 128, units: 2 },
        { x: 216, units: 3 },
        { x: 304, units: 4 },
      ].map((col, columnIndex) => (
        <g key={col.x} className={`capec-chart-column capec-chart-column-${columnIndex + 1}`}>
          {Array.from({ length: col.units }).map((_, u) => (
            <g key={`${col.x}-${u}`}>
            <rect
              x={col.x}
              y={182 - u * 40}
              width="76"
              height="36"
              rx="3"
              fill="url(#capec-fade)"
              stroke="currentColor"
              strokeOpacity="0.28"
            />
            <line
              x1={col.x + 26}
              x2={col.x + 26}
              y1={182 - u * 40}
              y2={218 - u * 40}
              stroke="currentColor"
              strokeOpacity="0.16"
            />
            <line
              x1={col.x + 50}
              x2={col.x + 50}
              y1={182 - u * 40}
              y2={218 - u * 40}
              stroke="currentColor"
              strokeOpacity="0.16"
            />
            </g>
          ))}
        </g>
      ))}

      {/* capital line */}
      <path
        d="M32 196 L78 178 L166 140 L254 104 L342 56 L392 40"
        stroke="var(--signal)"
        strokeWidth="2.5"
        strokeLinecap="square"
        pathLength="1"
        className="capec-chart-line"
      />
      {[
        { cx: 78, cy: 178 },
        { cx: 166, cy: 140 },
        { cx: 254, cy: 104 },
        { cx: 342, cy: 56 },
      ].map(({ cx, cy }, dotIndex) => (
        <rect
          key={cx}
          x={cx - 3.5}
          y={cy - 3.5}
          width="7"
          height="7"
          fill="var(--signal)"
          className={`capec-chart-dot capec-chart-dot-${dotIndex + 1}`}
        />
      ))}
    </svg>
  );
}
