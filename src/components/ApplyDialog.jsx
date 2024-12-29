"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useToast } from "../hooks/use-toast";
import { useWallet } from "../lib/WalletContext";
import { applyForScholarship } from "../lib/contracts";
import { useState } from "react";
import { useOCAuth } from "@opencampus/ocid-connect-js";

export function ApplyDialog({ scholarshipId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isConnected, connect, redirectToOCID, address } = useWallet();
  const { isInitialized, authState } = useOCAuth();

  const handleApply = async () => {
    try {
      setIsLoading(true);

      // Check wallet connection first
      if (!isConnected) {
        await connect();
        return;
      }

      // Check OCID authentication and wallet linking
      if (!isInitialized || !authState?.isAuthenticated || !authState?.OCId) {
        toast({
          title: "OpenCampus ID Required",
          description:
            "Please connect your OpenCampus ID to apply for scholarships.",
          variant: "destructive",
        });
        await redirectToOCID();
        return;
      }

      // Verify wallet address matches OCID
      if (authState.ethAddress?.toLowerCase() !== address?.toLowerCase()) {
        toast({
          title: "Wallet Mismatch",
          description:
            "Please use the wallet address linked to your OpenCampus ID.",
          variant: "destructive",
        });
        return;
      }

      // Proceed with application
      await applyForScholarship(scholarshipId);

      setIsOpen(false);
      toast({
        title: "Application Submitted",
        description:
          "Your scholarship application has been submitted successfully!",
      });
    } catch (err) {
      console.error("Error applying for scholarship:", err);

      // Handle specific error cases
      if (err.reason?.includes("Active OpenCampusID required")) {
        toast({
          title: "OpenCampus ID Required",
          description:
            "Please ensure your OpenCampus ID is active and properly linked to your wallet.",
          variant: "destructive",
        });
        await redirectToOCID();
      } else {
        toast({
          title: "Application Failed",
          description:
            err.reason || "Failed to submit application. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Apply Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply for Scholarship</DialogTitle>
          <DialogDescription>
            Submit your application for this scholarship opportunity. Make sure
            you meet all the requirements before applying.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" onClick={handleApply} disabled={isLoading}>
            {isLoading ? "Applying..." : "Submit Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
