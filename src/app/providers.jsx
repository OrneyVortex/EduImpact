"use client";

import { ThemeProvider } from "next-themes";
import OCConnectWrapper from "../components/OCConnectWrapper";

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <OCConnectWrapper>{children}</OCConnectWrapper>
    </ThemeProvider>
  );
}
