import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rider dashboard",
  description: "Rider app prototype: rides, distance and points.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
