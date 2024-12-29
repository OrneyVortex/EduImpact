"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Coins,
  FileText,
  GraduationCap,
  Trophy,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useWallet } from "@/lib/WalletContext";
import { Contract, parseEther, formatEther } from "ethers";
import ScholarshipABI from "@/config/Schloarship.json";
import { ScholarshipsAddress } from "@/config/contractAddress";

// Remove the temporary address and use the imported one
const scholarshipAddress = ScholarshipsAddress;

// Dummy data for user milestones
const userMilestones = {
  activeMilestones: [
    {
      id: 1,
      scholarshipTitle: "Web3 Development",
      sponsor: "BlockchainCo",
      milestone: "Smart Contract Basics",
      deadline: "2024-03-01",
      reward: "500 EDU",
      progress: 65,
      requirements: [
        { task: "Complete Solidity Basics Course", isCompleted: true },
        { task: "Build Simple Smart Contract", isCompleted: true },
        { task: "Pass Security Assessment", isCompleted: false },
        { task: "Deploy to Testnet", isCompleted: false },
      ],
    },
    {
      id: 2,
      scholarshipTitle: "AI Research Program",
      sponsor: "TechGiants",
      milestone: "Research Proposal",
      deadline: "2024-03-15",
      reward: "750 EDU",
      progress: 30,
      requirements: [
        { task: "Literature Review", isCompleted: true },
        { task: "Problem Statement", isCompleted: false },
        { task: "Methodology", isCompleted: false },
        { task: "Expected Outcomes", isCompleted: false },
      ],
    },
  ],
  completedMilestones: [
    {
      id: 3,
      scholarshipTitle: "Cloud Architecture",
      sponsor: "CloudMasters",
      milestone: "Cloud Fundamentals",
      completedDate: "2024-01-15",
      reward: "400 EDU",
      requirements: [
        { task: "AWS Core Services", isCompleted: true },
        { task: "Cloud Architecture Patterns", isCompleted: true },
        { task: "Security Best Practices", isCompleted: true },
        { task: "Cost Optimization", isCompleted: true },
      ],
    },
    {
      id: 4,
      scholarshipTitle: "Web3 Development",
      sponsor: "BlockchainCo",
      milestone: "DApp Development",
      completedDate: "2024-01-30",
      reward: "500 EDU",
      requirements: [
        { task: "Frontend Integration", isCompleted: true },
        { task: "Web3.js Implementation", isCompleted: true },
        { task: "User Authentication", isCompleted: true },
        { task: "Transaction Handling", isCompleted: true },
      ],
    },
  ],
  upcomingMilestones: [
    {
      id: 5,
      scholarshipTitle: "Web3 Development",
      sponsor: "BlockchainCo",
      milestone: "Security & Testing",
      startDate: "2024-03-15",
      reward: "500 EDU",
      requirements: [
        "Smart Contract Auditing",
        "Test Suite Development",
        "Security Best Practices",
        "Documentation",
      ],
    },
    {
      id: 6,
      scholarshipTitle: "AI Research Program",
      sponsor: "TechGiants",
      milestone: "Model Development",
      startDate: "2024-03-30",
      reward: "750 EDU",
      requirements: [
        "Dataset Preparation",
        "Model Architecture",
        "Training Pipeline",
        "Evaluation Metrics",
      ],
    },
  ],
};

export default function MilestonesPage() {
  const { address, provider } = useWallet();
  const [scholarshipContract, setScholarshipContract] = useState(null);
  const [realMilestones, setRealMilestones] = useState({
    activeMilestones: [],
    completedMilestones: [],
    upcomingMilestones: [],
    totalStaked: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initContract = async () => {
      if (provider && address) {
        const signer = await provider.getSigner();
        const contract = new Contract(
          scholarshipAddress,
          ScholarshipABI,
          signer
        );
        setScholarshipContract(contract);
      }
    };
    initContract();
  }, [provider, address]);

  useEffect(() => {
    const fetchScholarProgress = async () => {
      if (!scholarshipContract || !address) return;

      try {
        // Get all scholarships the user is part of
        const scholarships = [];
        let counter = 0;
        let hasMore = true;

        while (hasMore) {
          try {
            const details = await scholarshipContract.getScholarshipDetails(
              counter
            );
            if (details.selectedScholars.includes(address)) {
              scholarships.push({ id: counter, ...details });
            }
            counter++;
          } catch (error) {
            hasMore = false;
          }
        }

        // Fetch progress for each scholarship
        const active = [];
        const completed = [];
        const upcoming = [];
        let totalStakedAmount = 0n; // Using BigInt instead of BigNumber

        for (const scholarship of scholarships) {
          const [completedCount, totalMilestones, stakedAmount] =
            await scholarshipContract.getScholarProgress(
              scholarship.id,
              address
            );

          totalStakedAmount += stakedAmount;

          // Get all milestones
          const milestones = [];
          for (let i = 0; i < totalMilestones; i++) {
            const milestone = await scholarshipContract.getMilestone(
              scholarship.id,
              i
            );
            milestones.push({
              ...milestone,
              id: i,
              scholarshipId: scholarship.id,
              scholarshipTitle: scholarship.title,
              sponsor: scholarship.sponsor,
            });
          }

          // Sort milestones into categories
          milestones.forEach((milestone) => {
            const milestoneData = {
              id: `${scholarship.id}-${milestone.id}`,
              scholarshipTitle: scholarship.title,
              sponsor: scholarship.sponsor,
              milestone: milestone.title,
              reward: formatEther(milestone.reward) + " EDU",
              requirements: milestone.description.split(","),
              deadline: new Date(
                Number(scholarship.deadline) * 1000
              ).toISOString(),
            };

            if (milestone.isVerified) {
              completed.push({
                ...milestoneData,
                completedDate: new Date().toISOString(),
                requirements: milestone.description.split(",").map((req) => ({
                  task: req.trim(),
                  isCompleted: true,
                })),
              });
            } else if (milestone.isCompleted) {
              active.push({
                ...milestoneData,
                progress: 90,
                requirements: milestone.description.split(",").map((req) => ({
                  task: req.trim(),
                  isCompleted: true,
                })),
              });
            } else {
              const progress =
                (Number(completedCount) / Number(totalMilestones)) * 100;
              if (progress > 0) {
                active.push({
                  ...milestoneData,
                  progress: progress,
                  requirements: milestone.description.split(",").map((req) => ({
                    task: req.trim(),
                    isCompleted: false,
                  })),
                });
              } else {
                upcoming.push({
                  ...milestoneData,
                  startDate: new Date(
                    Number(scholarship.deadline) * 1000
                  ).toISOString(),
                  requirements: milestone.description.split(","),
                });
              }
            }
          });
        }

        setRealMilestones({
          activeMilestones: active,
          completedMilestones: completed,
          upcomingMilestones: upcoming,
          totalStaked: formatEther(totalStakedAmount),
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching scholar progress:", error);
        setIsLoading(false);
      }
    };

    fetchScholarProgress();
  }, [scholarshipContract, address]);

  // Combine real and dummy data, preferring real data when available
  const displayData = {
    activeMilestones: [
      ...(realMilestones.activeMilestones.length > 0
        ? realMilestones.activeMilestones
        : userMilestones.activeMilestones),
    ],
    completedMilestones: [
      ...(realMilestones.completedMilestones.length > 0
        ? realMilestones.completedMilestones
        : userMilestones.completedMilestones),
    ],
    upcomingMilestones: [
      ...(realMilestones.upcomingMilestones.length > 0
        ? realMilestones.upcomingMilestones
        : userMilestones.upcomingMilestones),
    ],
  };

  // Always show data (real or dummy) regardless of loading state
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Your Milestones</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your progress and achievements across all scholarships
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Milestones
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayData.activeMilestones.length}
              </div>
              <p className="text-xs text-muted-foreground">in progress</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayData.completedMilestones.length}
              </div>
              <p className="text-xs text-muted-foreground">
                milestones achieved
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {displayData.upcomingMilestones.length}
              </div>
              <p className="text-xs text-muted-foreground">
                milestones pending
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Rewards
              </CardTitle>
              <Coins className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,150 EDU</div>
              <p className="text-xs text-muted-foreground">earned so far</p>
            </CardContent>
          </Card>
        </div>

        {/* Milestones Tabs */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <Tabs defaultValue="active" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              </TabsList>

              {/* Active Milestones */}
              <TabsContent value="active">
                <div className="space-y-6 relative">
                  {displayData.activeMilestones.map((milestone) => (
                    <Card
                      key={milestone.id}
                      className="border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{milestone.milestone}</CardTitle>
                            <CardDescription>
                              {milestone.scholarshipTitle} • Sponsored by{" "}
                              {milestone.sponsor}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">{milestone.reward}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Progress
                            </span>
                            <span>{milestone.progress}%</span>
                          </div>
                          <Progress
                            value={milestone.progress}
                            className="h-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/5 backdrop-blur-[1px] rounded-lg">
                      <div className="bg-background/90 px-6 py-3 rounded-lg border shadow-lg flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>Loading blockchain data...</span>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Completed Milestones */}
              <TabsContent value="completed">
                <div className="space-y-6 relative">
                  {displayData.completedMilestones.map((milestone) => (
                    <Card
                      key={milestone.id}
                      className="border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{milestone.milestone}</CardTitle>
                            <CardDescription>
                              {milestone.scholarshipTitle} • Sponsored by{" "}
                              {milestone.sponsor}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">{milestone.reward}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">
                            Completed Requirements
                          </h4>
                          <div className="space-y-2">
                            {milestone.requirements.map((req, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4 text-primary" />
                                <span className="text-sm">{req.task}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GraduationCap className="w-4 h-4" />
                            <span>
                              Completed on{" "}
                              {new Date(
                                milestone.completedDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <Button variant="outline">View Certificate</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/5 backdrop-blur-[1px] rounded-lg">
                      <div className="bg-background/90 px-6 py-3 rounded-lg border shadow-lg flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>Loading blockchain data...</span>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Upcoming Milestones */}
              <TabsContent value="upcoming">
                <div className="space-y-6 relative">
                  {displayData.upcomingMilestones.map((milestone) => (
                    <Card
                      key={milestone.id}
                      className="border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{milestone.milestone}</CardTitle>
                            <CardDescription>
                              {milestone.scholarshipTitle} • Sponsored by{" "}
                              {milestone.sponsor}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary">{milestone.reward}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Requirements</h4>
                          <div className="space-y-2">
                            {milestone.requirements.map((req, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {req}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>
                              Starts{" "}
                              {new Date(
                                milestone.startDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <Button variant="outline" disabled>
                            Coming Soon
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/5 backdrop-blur-[1px] rounded-lg">
                      <div className="bg-background/90 px-6 py-3 rounded-lg border shadow-lg flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>Loading blockchain data...</span>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
