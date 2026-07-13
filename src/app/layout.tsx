import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display:  "swap",
});

export const metadata: Metadata = {
  title:       "ServiceHub — Book Local Services Instantly",
  description: "ServiceHub connects customers with trusted local vendors. Book home cleaning, plumbing, electrical, and 20+ service categories.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {children}
      </body>
    </html>
  );
}
