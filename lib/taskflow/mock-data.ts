import type { Task } from "./types"

const today = new Date()
function daysFromNow(days: number) {
  const d = new Date(today)
  d.setDate(d.getDate() + days)
  d.setHours(17, 0, 0, 0)
  return d.toISOString()
}
function daysAgo(days: number) {
  const d = new Date(today)
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    title: "Design new pricing page",
    description:
      "Redesign the pricing page with a cleaner hierarchy, feature comparison table and a new testimonial band. Align with the new brand system.",
    status: "doing",
    priority: "high",
    dueDate: daysFromNow(2),
    tags: ["UI/UX", "Marketing"],
    subtasks: [
      { id: "s1", title: "Wireframes in Figma", completed: true },
      { id: "s2", title: "High-fidelity mockups", completed: true },
      { id: "s3", title: "Responsive variants", completed: false },
      { id: "s4", title: "Handoff to dev", completed: false },
    ],
    comments: [
      {
        id: "c1",
        author: "Lucía García",
        avatar: "LG",
        message: "Updated the hero section with the new tagline from marketing.",
        createdAt: daysAgo(1),
      },
      {
        id: "c2",
        author: "Diego Romero",
        avatar: "DR",
        message: "Looks great! Let's add a dark variant in a follow-up.",
        createdAt: daysAgo(0),
      },
    ],
    history: [
      { id: "h1", action: "Created task", actor: "Lucía García", at: daysAgo(5) },
      { id: "h2", action: "Moved to Doing", actor: "Lucía García", at: daysAgo(3) },
      { id: "h3", action: "Set priority to High", actor: "Diego Romero", at: daysAgo(2) },
    ],
    assignee: { name: "Lucía García", avatar: "LG" },
    createdAt: daysAgo(5),
    updatedAt: daysAgo(0),
  },
  {
    id: "t2",
    title: "Implement dark-neutral tokens",
    description:
      "Create a tokens.json for the premium light theme. Map semantic tokens to Tailwind utilities and verify contrast ratios on AA.",
    status: "todo",
    priority: "medium",
    dueDate: daysFromNow(5),
    tags: ["Frontend", "Design System"],
    subtasks: [
      { id: "s1", title: "Audit existing colors", completed: false },
      { id: "s2", title: "Define semantic scale", completed: false },
      { id: "s3", title: "Document on Storybook", completed: false },
    ],
    comments: [],
    history: [{ id: "h1", action: "Created task", actor: "Diego Romero", at: daysAgo(1) }],
    assignee: { name: "Diego Romero", avatar: "DR" },
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "t3",
    title: "Refactor dashboard data layer",
    description:
      "Introduce SWR for the dashboard. Centralize fetchers and add optimistic updates for task status changes.",
    status: "doing",
    priority: "high",
    dueDate: daysFromNow(1),
    tags: ["Frontend", "Performance"],
    subtasks: [
      { id: "s1", title: "Install & configure SWR", completed: true },
      { id: "s2", title: "Migrate useTasks hook", completed: true },
      { id: "s3", title: "Add optimistic mutation", completed: false },
      { id: "s4", title: "Unit tests", completed: false },
      { id: "s5", title: "Docs update", completed: false },
    ],
    comments: [
      {
        id: "c1",
        author: "Mateo Ibáñez",
        avatar: "MI",
        message: "Optimistic UI is working great on my branch.",
        createdAt: daysAgo(0),
      },
    ],
    history: [
      { id: "h1", action: "Created task", actor: "Mateo Ibáñez", at: daysAgo(6) },
      { id: "h2", action: "Moved to Doing", actor: "Mateo Ibáñez", at: daysAgo(4) },
    ],
    assignee: { name: "Mateo Ibáñez", avatar: "MI" },
    createdAt: daysAgo(6),
    updatedAt: daysAgo(0),
  },
  {
    id: "t4",
    title: "Write E2E tests for onboarding",
    description:
      "Cover the full onboarding flow with Playwright. Include multi-step forms, validation errors and a happy path.",
    status: "todo",
    priority: "medium",
    dueDate: daysFromNow(7),
    tags: ["Testing", "QA"],
    subtasks: [
      { id: "s1", title: "Setup Playwright", completed: true },
      { id: "s2", title: "Happy path", completed: false },
      { id: "s3", title: "Edge cases", completed: false },
    ],
    comments: [],
    history: [{ id: "h1", action: "Created task", actor: "Sara Mendes", at: daysAgo(2) }],
    assignee: { name: "Sara Mendes", avatar: "SM" },
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: "t5",
    title: "Landing page hero animation",
    description:
      "Ship a subtle parallax animation on the hero. Keep it under 16ms per frame and respect prefers-reduced-motion.",
    status: "done",
    priority: "low",
    dueDate: daysAgo(1),
    tags: ["UI/UX", "Frontend"],
    subtasks: [
      { id: "s1", title: "Motion prototype", completed: true },
      { id: "s2", title: "Implementation", completed: true },
      { id: "s3", title: "Perf review", completed: true },
    ],
    comments: [
      {
        id: "c1",
        author: "Lucía García",
        avatar: "LG",
        message: "Shipped and looking smooth across devices ✨",
        createdAt: daysAgo(1),
      },
    ],
    history: [
      { id: "h1", action: "Created task", actor: "Lucía García", at: daysAgo(10) },
      { id: "h2", action: "Moved to Done", actor: "Lucía García", at: daysAgo(1) },
    ],
    assignee: { name: "Lucía García", avatar: "LG" },
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1),
  },
  {
    id: "t6",
    title: "Update documentation for API v2",
    description:
      "Rewrite the REST reference for v2 endpoints. Include authentication section, rate limits and examples in cURL and TS.",
    status: "todo",
    priority: "high",
    dueDate: daysFromNow(3),
    tags: ["Documentation", "API"],
    subtasks: [
      { id: "s1", title: "Auth section", completed: false },
      { id: "s2", title: "Endpoints reference", completed: false },
      { id: "s3", title: "Code examples", completed: false },
      { id: "s4", title: "Changelog", completed: false },
    ],
    comments: [],
    history: [{ id: "h1", action: "Created task", actor: "Diego Romero", at: daysAgo(3) }],
    assignee: { name: "Diego Romero", avatar: "DR" },
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    id: "t7",
    title: "Accessibility audit on checkout",
    description:
      "Run an axe audit on the checkout funnel. Fix focus management on modals and keyboard navigation in the stepper.",
    status: "doing",
    priority: "medium",
    dueDate: daysFromNow(4),
    tags: ["A11y", "Frontend"],
    subtasks: [
      { id: "s1", title: "Automated audit", completed: true },
      { id: "s2", title: "Manual keyboard test", completed: false },
      { id: "s3", title: "Screen reader pass", completed: false },
    ],
    comments: [],
    history: [
      { id: "h1", action: "Created task", actor: "Sara Mendes", at: daysAgo(4) },
      { id: "h2", action: "Moved to Doing", actor: "Sara Mendes", at: daysAgo(2) },
    ],
    assignee: { name: "Sara Mendes", avatar: "SM" },
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
  },
  {
    id: "t8",
    title: "Build component: Command palette",
    description: "Ship a ⌘K command palette with fuzzy search, recent items and keyboard shortcuts.",
    status: "done",
    priority: "medium",
    dueDate: daysAgo(2),
    tags: ["Frontend", "DX"],
    subtasks: [
      { id: "s1", title: "Shell & shortcuts", completed: true },
      { id: "s2", title: "Fuzzy search", completed: true },
      { id: "s3", title: "Tests", completed: true },
    ],
    comments: [],
    history: [
      { id: "h1", action: "Created task", actor: "Mateo Ibáñez", at: daysAgo(12) },
      { id: "h2", action: "Moved to Done", actor: "Mateo Ibáñez", at: daysAgo(2) },
    ],
    assignee: { name: "Mateo Ibáñez", avatar: "MI" },
    createdAt: daysAgo(12),
    updatedAt: daysAgo(2),
  },
  {
    id: "t9",
    title: "Migrate icons to lucide-react",
    description: "Replace custom SVG icons with lucide-react for consistency and tree-shaking.",
    status: "todo",
    priority: "low",
    dueDate: daysFromNow(10),
    tags: ["Frontend", "Refactor"],
    subtasks: [
      { id: "s1", title: "Inventory icons", completed: false },
      { id: "s2", title: "Codemod replacements", completed: false },
    ],
    comments: [],
    history: [{ id: "h1", action: "Created task", actor: "Diego Romero", at: daysAgo(1) }],
    assignee: { name: "Diego Romero", avatar: "DR" },
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "t10",
    title: "Launch changelog page",
    description: "Publish a public changelog with filtering by product area and RSS feed.",
    status: "doing",
    priority: "low",
    dueDate: daysFromNow(6),
    tags: ["Marketing", "Documentation"],
    subtasks: [
      { id: "s1", title: "Design", completed: true },
      { id: "s2", title: "Content pipeline", completed: false },
      { id: "s3", title: "RSS generation", completed: false },
    ],
    comments: [],
    history: [
      { id: "h1", action: "Created task", actor: "Lucía García", at: daysAgo(7) },
      { id: "h2", action: "Moved to Doing", actor: "Lucía García", at: daysAgo(3) },
    ],
    assignee: { name: "Lucía García", avatar: "LG" },
    createdAt: daysAgo(7),
    updatedAt: daysAgo(3),
  },
]
