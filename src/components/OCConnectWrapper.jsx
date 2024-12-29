"use client";

import { ReactNode } from "react";
import { OCConnect } from "@opencampus/ocid-connect-js";

export default function OCConnectWrapper({ children }) {
  const opts = {
    redirectUri:
      process.env.NEXT_PUBLIC_REDIRECT_URI ||
      `${window.location.origin}/redirect`,
    referralCode: process.env.NEXT_PUBLIC_REFERRAL_CODE || "EDUIMPACT",
  };

  return (
    <OCConnect opts={opts} sandboxMode={true}>
      {children}
    </OCConnect>
  );
}
