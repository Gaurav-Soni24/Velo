import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rewards",
  description: "Rider app prototype: points earned by riding Velo bikes.",
  alternates: { canonical: "/rewards" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
