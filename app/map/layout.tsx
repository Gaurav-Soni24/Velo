import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rider app map",
  description: "Rider app prototype: find a Velo stand and the bikes free there.",
  alternates: { canonical: "/map" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
