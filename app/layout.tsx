import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Systems Notes",
  description: "A minimal blog about backend engineering, systems, and infrastructure."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <SiteHeader />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
