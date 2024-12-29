import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EduImpact - Decentralized Tech Education",
  description:
    "A blockchain-based platform for incentivizing learning and contributions to technology communities.",
  icons: {
    icon: [
      {
        url: "/logo.png",
        href: "/logo.png",
      },
    ],
    apple: [
      {
        url: "/logo.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-b from-background to-muted/50`}
      >
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}
