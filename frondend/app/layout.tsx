import type React from "react"
import { ApiProvider } from "@/components/api-integration/api-context"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ApiProvider>{children}</ApiProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
