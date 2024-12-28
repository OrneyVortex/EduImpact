"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginCallBack, useOCAuth } from "@opencampus/ocid-connect-js";
import { useToast } from "../../hooks/use-toast";

export default function RedirectPage() {
  const router = useRouter();
  const { toast } = useToast();

  const loginSuccess = () => {
    toast({
      title: "Success",
      description: "Successfully connected with OpenCampus ID",
    });
    router.push("/");
  };

  const loginError = (error) => {
    console.error("Login error:", error);
    toast({
      title: "Error",
      description: "Failed to connect with OpenCampus ID. Please try again.",
      variant: "destructive",
    });
    router.push("/");
  };

  function CustomErrorComponent() {
    const { authState } = useOCAuth();
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Error Logging In</h1>
        <p className="text-red-500">{authState.error?.message}</p>
      </div>
    );
  }

  function CustomLoadingComponent() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Connecting to OpenCampus ID</h1>
        <p>Please wait while we complete the authentication process...</p>
      </div>
    );
  }

  return (
    <LoginCallBack
      errorCallback={loginError}
      successCallback={loginSuccess}
      customErrorComponent={CustomErrorComponent}
      customLoadingComponent={CustomLoadingComponent}
    />
  );
}
