import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";

const display = Baloo_2({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });
const body = Nunito({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL("https://school-food-registration.vercel.app"),
  title: "MealBee: Healthy school lunches in Dubai",
  description:
    "Fresh, healthy lunches ordered in an app and delivered to your child's school. Join the MealBee waitlist.",
  openGraph: {
    title: "MealBee: Healthy school lunches",
    description: "Bee happy, bee healthy. Join the waitlist for fresh school lunches in Dubai.",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
