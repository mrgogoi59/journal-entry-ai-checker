import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform Preview | AccyWise AI",
  description: "Internal AccyWise AI platform shell preview for founder review.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PlatformPreviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
