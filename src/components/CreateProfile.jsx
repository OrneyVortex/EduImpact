"use client";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useWallet } from "../lib/WalletContext";

export default function CreateProfile() {
  const { redirectToOCID } = useWallet();

  return (
    <Card className="w-[350px] mx-auto mt-8">
      <CardHeader>
        <CardTitle>OpenCampus ID Required</CardTitle>
        <CardDescription>
          You need an OpenCampus ID to use EduImpact. Choose an option below:
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button onClick={redirectToOCID} className="w-full">
          Create OpenCampus ID
        </Button>
        <Button onClick={redirectToOCID} variant="outline" className="w-full">
          Enter Existing OpenCampus ID
        </Button>
      </CardContent>
    </Card>
  );
}
