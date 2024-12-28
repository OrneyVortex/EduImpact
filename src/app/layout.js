import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import { Providers } from "./providers";
import { Toaster } from "../components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EduImpact - Decentralized Tech Learning Platform",
  description: "Empowering Tech Innovators Through Decentralized Scholarships",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">{children}</main>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
