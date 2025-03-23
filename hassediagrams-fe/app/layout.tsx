import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import "@/styles/globals.css";

const raleway = Raleway({
  weight: ["300", "400"],
  subsets: ["latin"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Hasse Diagrams",
  description: "Web app for working with Hasse diagrams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} ${raleway.className} antialiased  min-h-screen flex flex-col`}
      >
        <Header />

        <main className="flex-1 min-h-0 px-72 pt-12">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
