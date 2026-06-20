export const studentPlatformNavigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    mark: "D",
    status: "available",
    href: "/dashboard",
  },
  {
    id: "chapters",
    label: "Chapters",
    mark: "C",
    status: "available",
    href: "/chapters",
  },
  {
    id: "solver",
    label: "Solver",
    mark: "S",
    status: "available",
    href: "/tools",
  },
  {
    id: "practice",
    label: "Practice",
    mark: "P",
    status: "available",
    href: "/practice",
  },
  {
    id: "assistant",
    label: "AI Assistant",
    mark: "AI",
    status: "coming-soon",
    href: undefined,
  },
] as const;

export type StudentPlatformNavigationItem = (typeof studentPlatformNavigationItems)[number];
export type StudentPlatformNavigationId = StudentPlatformNavigationItem["id"];
