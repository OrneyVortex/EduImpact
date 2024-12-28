import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/lib/WalletContext";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EduImpact - Decentralized Tech Education",
  description:
    "A blockchain-based platform for incentivizing learning and contributions to technology communities.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <div className="relative min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <div className="container py-6">{children}</div>
            </main>
          </div>
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
}
