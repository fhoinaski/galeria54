import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin — Caffè 54", template: "%s — Admin Caffè 54" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
