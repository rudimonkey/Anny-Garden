import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anny's Plantitas",
  description: "Bilingual plant catalog and management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
