"use client";

import { WalletProvider } from "../lib/WalletContext";
import Header from "./Header";
import { Toaster } from "./ui/toaster";
import { OCConnect } from "@opencampus/ocid-connect-js";

const opts = {
  redirectUri:
    process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/redirect",
  referralCode: process.env.NEXT_PUBLIC_REFERRAL_CODE || "PARTNER6",
};

export default function ClientLayout({ children }) {
  return (
    <OCConnect opts={opts} sandboxMode={true}>
      <WalletProvider>
        <div className="relative min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <div className="container py-6">{children}</div>
          </main>
        </div>
        <Toaster />
      </WalletProvider>
    </OCConnect>
  );
}
