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
    <html lang="sk">
      <body className={`${raleway.variable} ${raleway.className} antialiased`}>
        <Header />

        <div className="px-72 pt-28">
          { children }
        </div>
        
        <Footer />
      </body>
    </html>
  );
}
