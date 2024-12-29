"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import {
  CheckCircle,
  Clock,
  Coins,
  FileText,
  Trophy,
  Users,
} from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { applyForScholarship } from "../../lib/contracts";
import { useWallet } from "../../lib/WalletContext";
import { useState } from "react";
import SubmitMilestoneDialog from "./SubmitMilestoneDialog";
import { ethers } from "ethers";
import { useOCAuth } from "@opencampus/ocid-connect-js";

export default function ApplyDialog({ scholarship, trigger }) {
  const { toast } = useToast();
  const { isConnected, connect, redirectToOCID, address } = useWallet();
  const { isInitialized, authState } = useOCAuth();
  const [loading, setLoading] = useState(false);

  if (!scholarship) return null;

  const handleApply = async () => {
    if (!isConnected) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      await connect();
      return;
    }

    // Check OCID authentication and wallet linking
    if (!isInitialized || !authState?.isAuthenticated || !authState?.OCId) {
      toast({
        title: "OpenCampus ID Required",
        description: "Please connect your OpenCampus ID to apply for scholarships.",
        variant: "destructive",
      });
      await redirectToOCID();
      return;
    }

    // Verify wallet address matches OCID
    if (authState.ethAddress?.toLowerCase() !== address?.toLowerCase()) {
      toast({
        title: "Wallet Mismatch",
        description: "Please use the wallet address linked to your OpenCampus ID.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const numericId = scholarship.id.replace(/^real-/, "");
      const scholarshipId = ethers.getBigInt(numericId);

      const tx = await applyForScholarship(scholarshipId);
      console.log("Application submitted:", tx);

      toast({
        title: "Success",
        description: "Your application has been submitted successfully!",
      });
    } catch (error) {
      console.error("Error applying for scholarship:", error);
      if (error.reason?.includes("Active OpenCampusID required")) {
        toast({
          title: "OpenCampus ID Required",
          description: "Please ensure your OpenCampus ID is active and properly linked to your wallet.",
          variant: "destructive",
        });
        await redirectToOCID();
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to apply for scholarship. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button>Apply Now</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            {scholarship.title}
            <Badge variant="secondary">{scholarship.category}</Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 pt-2">
            <Users className="w-4 h-4" />
            Sponsored by {scholarship.sponsor}
          </DialogDescription>
        </DialogHeader>

        {/* Scholarship Details */}
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">
              {scholarship.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Reward</p>
                <p className="text-lg font-bold">{scholarship.amount} EDU</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Milestones</p>
                <p className="text-lg font-bold">
                  {scholarship.totalMilestones}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Deadline</p>
                <p className="text-lg font-bold">
                  {scholarship.deadline instanceof Date
                    ? scholarship.deadline.toLocaleDateString()
                    : new Date(scholarship.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {scholarship.skills?.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-4">Milestones</h4>
            <Accordion type="single" collapsible className="w-full">
              {scholarship.milestones?.map((milestone, index) => (
                <AccordionItem
                  key={`milestone-${index}`}
                  value={`milestone-${index}`}
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>{milestone.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {milestone.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">
                            Reward: {milestone.reward} EDU
                          </span>
                        </div>
                        <SubmitMilestoneDialog
                          scholarship={scholarship}
                          milestoneIndex={index}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <DialogFooter>
            <Button className="w-full" onClick={handleApply} disabled={loading}>
              {loading ? "Applying..." : "Apply for Scholarship"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
