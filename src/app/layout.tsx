import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShipUAE - UAE's Leading Shipping Platform",
  description: "Compare shipping rates from top UAE carriers, track your packages in real-time, and enjoy seamless delivery experiences across all Emirates.",
  keywords: "shipping UAE, package delivery, courier service, UAE logistics, package tracking",
  authors: [{ name: "ShipUAE Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
  openGraph: {
    title: "ShipUAE - UAE's Leading Shipping Platform",
    description: "Compare shipping rates from top UAE carriers, track your packages in real-time, and enjoy seamless delivery experiences across all Emirates.",
    type: "website",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipUAE - UAE's Leading Shipping Platform",
    description: "Compare shipping rates from top UAE carriers, track your packages in real-time, and enjoy seamless delivery experiences across all Emirates.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}