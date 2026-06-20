export const previewNavigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/platform-preview",
    mark: "D",
    status: "available",
  },
  {
    id: "chapters",
    label: "Chapters",
    href: "/platform-preview/chapters",
    mark: "C",
    status: "available",
  },
  {
    id: "solver",
    label: "Solver",
    href: undefined,
    mark: "S",
    status: "upcoming",
  },
  {
    id: "practice",
    label: "Practice",
    href: undefined,
    mark: "P",
    status: "upcoming",
  },
  {
    id: "assistant",
    label: "AI Assistant",
    href: undefined,
    mark: "AI",
    status: "upcoming",
  },
] as const;

export type PreviewNavigationItem = (typeof previewNavigationItems)[number];
export type PreviewNavigationId = PreviewNavigationItem["id"];
