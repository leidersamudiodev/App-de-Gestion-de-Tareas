interface CircularProgressProps {
  value: number // 0-100
  size?: number
  stroke?: number
  label?: string
  sub?: string
}

export function CircularProgress({
  value,
  size = 120,
  stroke = 10,
  label,
  sub,
}: CircularProgressProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (clamped / 100) * c

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke="url(#cp-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
        <defs>
          <linearGradient id="cp-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
          {Math.round(clamped)}
          <span className="text-sm font-medium text-muted-foreground">%</span>
        </span>
        {label && <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>}
        {sub && <span className="mt-0.5 text-[11px] text-muted-foreground">{sub}</span>}
      </div>
    </div>
  )
}
