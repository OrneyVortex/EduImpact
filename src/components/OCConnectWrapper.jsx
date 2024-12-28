"use client";

import { ReactNode } from "react";
import { OCConnect } from "@opencampus/ocid-connect-js";

const opts = {
  redirectUri:
    process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/redirect",
  referralCode: process.env.NEXT_PUBLIC_REFERRAL_CODE || "EDUIMPACT",
};

export default function OCConnectWrapper({ children }) {
  return (
    <OCConnect opts={opts} sandboxMode={true}>
      {children}
    </OCConnect>
  );
}
