import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "EduImpact - Decentralized Tech Education",
  description:
    "A blockchain-based platform for incentivizing learning and contributions to technology communities.",
  icons: {
    icon: [{ url: "/logo.png", href: "/logo.png" }],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        {/* Gradient background */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--tw-gradient-from)_0%,var(--tw-gradient-to)_100%)] from-background to-muted" />

        {/* Background decoration */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-10" />

        <div className="relative flex min-h-screen flex-col">
          {/* Blur effect for header */}
          <div className="fixed top-0 z-40 w-full backdrop-blur-[8px] bg-background/60 transition-all duration-300" />

          {/* Main content */}
          <main className="flex-1 ">
            <ClientLayout >
              <div className="animate-fade-in w-screen">{children}</div>
            </ClientLayout>
          </main>
        </div>
      </body>
    </html>
  );
}
