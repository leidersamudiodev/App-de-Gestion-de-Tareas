const TAG_STYLES: { test: RegExp; bg: string; text: string }[] = [
  { test: /ui|ux|design/i, bg: "bg-[#ede9fe]", text: "text-[#6d28d9]" },
  { test: /front|react|refactor/i, bg: "bg-accent", text: "text-accent-foreground" },
  { test: /doc|api/i, bg: "bg-[#ecfeff]", text: "text-[#0e7490]" },
  { test: /test|qa/i, bg: "bg-[#fef3c7]", text: "text-[#a16207]" },
  { test: /perf|dx|system/i, bg: "bg-[#ecfccb]", text: "text-[#3f6212]" },
  { test: /market/i, bg: "bg-[#ffe4e6]", text: "text-[#be123c]" },
  { test: /a11y/i, bg: "bg-[#dbeafe]", text: "text-[#1e40af]" },
]

function styleFor(label: string) {
  for (const s of TAG_STYLES) if (s.test.test(label)) return s
  return { bg: "bg-muted", text: "text-muted-foreground" }
}

export function TagPill({ label }: { label: string }) {
  const s = styleFor(label)
  return (
    <span
      className={[
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium",
        s.bg,
        s.text,
      ].join(" ")}
    >
      {label}
    </span>
  )
}
