import { Archivo } from "next/font/google"

/** Archivo with its width axis: extended for kit lettering, normal width for reading. */
export const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" })
