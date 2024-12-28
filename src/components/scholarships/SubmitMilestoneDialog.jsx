"use client";

import { useState } from "react";
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
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../hooks/use-toast";
import { submitMilestone } from "../../lib/contracts";
import { useWallet } from "../../lib/WalletContext";
import { ethers } from "ethers";

export default function SubmitMilestoneDialog({
  scholarship,
  milestoneIndex,
  trigger,
}) {
  const { toast } = useToast();
  const { isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [submission, setSubmission] = useState({
    proof: "",
    description: "",
  });

  const handleSubmit = async () => {
    if (!isConnected) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!submission.proof || !submission.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const numericId = scholarship.id.replace(/^real-/, "");
      const scholarshipId = ethers.getBigInt(numericId);

      const tx = await submitMilestone(
        scholarshipId,
        milestoneIndex,
        submission.proof,
        submission.description
      );
      console.log("Milestone submitted:", tx);

      toast({
        title: "Success",
        description: "Your milestone submission has been received!",
      });
    } catch (error) {
      console.error("Error submitting milestone:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to submit milestone. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Submit Milestone</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Milestone</DialogTitle>
          <DialogDescription>
            Provide proof and description of your milestone completion.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="proof">Proof URL</Label>
            <Input
              id="proof"
              placeholder="Enter the URL of your proof (e.g., GitHub repository)"
              value={submission.proof}
              onChange={(e) =>
                setSubmission((prev) => ({ ...prev, proof: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe how you completed this milestone"
              value={submission.description}
              onChange={(e) =>
                setSubmission((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Submitting..." : "Submit Milestone"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
