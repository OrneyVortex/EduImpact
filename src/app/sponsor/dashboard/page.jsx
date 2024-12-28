"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/lib/WalletContext";
import {
  getScholarshipDetails,
  getMilestone,
  verifyMilestone,
} from "@/lib/contracts";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCheck, Clock } from "lucide-react";

export default function SponsorDashboard() {
  const [scholarships, setScholarships] = useState([]);
  const [pendingMilestones, setPendingMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMilestones, setLoadingMilestones] = useState(false);
  const [verifyingMilestone, setVerifyingMilestone] = useState(null);
  const { address, isConnected } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    if (isConnected && address) {
      loadScholarships();
    }
  }, [isConnected, address]);

  const loadScholarships = async () => {
    try {
      setLoading(true);
      console.log("Loading scholarships for address:", address);

      // Try to fetch first 10 scholarships
      const scholarshipPromises = Array.from({ length: 10 }, async (_, id) => {
        try {
          const details = await getScholarshipDetails(id);
          console.log(`Scholarship ${id} details:`, details);
          return details;
        } catch (error) {
          console.error(`Error fetching scholarship ${id}:`, error);
          return null;
        }
      });

      const scholarshipDetails = (
        await Promise.all(scholarshipPromises)
      ).filter(
        (scholarship) =>
          scholarship !== null &&
          scholarship.sponsor?.toLowerCase() === address?.toLowerCase()
      );

      console.log("All scholarships:", scholarshipDetails);

      setScholarships(scholarshipDetails);
      await loadPendingMilestones(scholarshipDetails);
    } catch (error) {
      console.error("Error in loadScholarships:", error);
      toast({
        title: "Error Loading Scholarships",
        description:
          error.message || "Failed to load scholarships. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPendingMilestones = async (scholarshipsList) => {
    try {
      setLoadingMilestones(true);
      console.log(
        "Loading pending milestones for scholarships:",
        scholarshipsList
      );

      const allPendingMilestones = [];

      for (const scholarship of scholarshipsList) {
        if (!scholarship) continue;

        console.log(`Checking milestones for scholarship ${scholarship.id}`);
        console.log("Total milestones:", scholarship.totalMilestones);

        // For each scholarship, check all milestones up to totalMilestones
        for (let i = 0; i < scholarship.totalMilestones; i++) {
          try {
            console.log(
              `Fetching milestone ${i} for scholarship ${scholarship.id}`
            );
            const milestone = await getMilestone(scholarship.id, i);
            console.log(`Milestone ${i} details:`, milestone);

            if (!milestone.isVerified && milestone.proofIpfsHash) {
              console.log(`Found pending milestone:`, {
                scholarshipId: scholarship.id,
                milestoneId: i,
                milestone,
              });

              allPendingMilestones.push({
                scholarshipId: scholarship.id,
                scholarshipTitle: scholarship.title,
                milestoneId: i,
                ...milestone,
              });
            }
          } catch (error) {
            console.error(
              `Error fetching milestone ${i} for scholarship ${scholarship.id}:`,
              error
            );
          }
        }
      }

      console.log("All pending milestones:", allPendingMilestones);
      setPendingMilestones(allPendingMilestones);
    } catch (error) {
      console.error("Error in loadPendingMilestones:", error);
      toast({
        title: "Error Loading Milestones",
        description:
          error.message ||
          "Failed to load milestone details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingMilestones(false);
    }
  };

  const handleVerifyMilestone = async (
    scholarshipId,
    milestoneId,
    scholarAddress
  ) => {
    try {
      setVerifyingMilestone(`${scholarshipId}-${milestoneId}`);
      console.log("Verifying milestone with params:", {
        scholarshipId,
        milestoneId,
        scholarAddress,
      });

      const tx = await verifyMilestone(
        scholarshipId,
        milestoneId,
        scholarAddress
      );
      console.log("Verification transaction:", tx);

      toast({
        title: "Success",
        description: "Milestone verified successfully!",
      });

      // Reload scholarships and milestones to reflect changes
      await loadScholarships();
    } catch (error) {
      console.error("Error in handleVerifyMilestone:", error);
      toast({
        title: "Verification Failed",
        description:
          error.message || "Failed to verify milestone. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVerifyingMilestone(null);
    }
  };

  const handleContinueToMilestones = (scholarshipId) => {
    try {
      console.log("Button clicked! ScholarshipId:", scholarshipId);
      console.log("Current URL:", window.location.href);
      console.log("Attempting to navigate to:", `/sponsor/create/milestones`);

      // Navigate to the create milestones page
      window.location.href = `/sponsor/create/milestones`;

      console.log("Navigation initiated");
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        scholarshipId,
      });
      toast({
        title: "Navigation Error",
        description:
          "Failed to navigate to milestone creation. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to view your sponsored scholarships.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p>Loading scholarships...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sponsor Dashboard</h2>
        <Button variant="default" asChild>
          <a href="/sponsor/create">Create Scholarship</a>
        </Button>
      </div>

      <Tabs defaultValue="scholarships">
        <TabsList>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="milestones">
            Pending Milestones{" "}
            {pendingMilestones.length > 0 && `(${pendingMilestones.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scholarships">
          <Card>
            <CardHeader>
              <CardTitle>Your Scholarships</CardTitle>
              <CardDescription>
                Manage your sponsored scholarships and track scholar progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scholarships.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    You haven't created any scholarships yet.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scholarships.map((scholarship) => (
                      <TableRow key={scholarship.id}>
                        <TableCell className="font-medium">
                          {scholarship.title}
                        </TableCell>
                        <TableCell>{scholarship.category}</TableCell>
                        <TableCell>{scholarship.totalAmount} EDU</TableCell>
                        <TableCell>{scholarship.remainingAmount} EDU</TableCell>
                        <TableCell>
                          {new Date(scholarship.deadline).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              scholarship.isActive ? "default" : "secondary"
                            }
                          >
                            {scholarship.isActive ? "Active" : "Completed"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={`/sponsor/scholarships/${scholarship.id}`}
                              >
                                View Details
                              </a>
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                console.log(
                                  "Button clicked, preventing default"
                                );
                                handleContinueToMilestones(scholarship.id);
                              }}
                            >
                              Continue to Milestones
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Pending Verifications
              </CardTitle>
              <CardDescription>
                Milestone submissions awaiting your verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingMilestones.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    No pending milestone verifications.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingMilestones.map((milestone) => (
                    <div
                      key={`${milestone.scholarshipId}-${milestone.milestoneId}`}
                      className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-4 space-y-4 md:space-y-0"
                    >
                      <div>
                        <h3 className="font-medium">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {milestone.scholarshipTitle} - Milestone{" "}
                          {milestone.milestoneId + 1}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          Reward: {milestone.reward} EDU
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://ipfs.io/ipfs/${milestone.proofIpfsHash}`,
                              "_blank"
                            )
                          }
                        >
                          View Proof
                        </Button>
                        <Button
                          size="sm"
                          disabled={
                            verifyingMilestone ===
                            `${milestone.scholarshipId}-${milestone.milestoneId}`
                          }
                          onClick={() =>
                            handleVerifyMilestone(
                              milestone.scholarshipId,
                              milestone.milestoneId,
                              milestone.scholarAddress
                            )
                          }
                        >
                          {verifyingMilestone ===
                          `${milestone.scholarshipId}-${milestone.milestoneId}`
                            ? "Verifying..."
                            : "Verify"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
