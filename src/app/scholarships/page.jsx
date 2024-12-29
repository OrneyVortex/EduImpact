"use client";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Coins, Users, Trophy } from "lucide-react";
import ApplyDialog from "../../components/scholarships/ApplyDialog";
import { useState, useEffect } from "react";
import { useWallet } from "../../lib/WalletContext";
import { getScholarshipDetails } from "../../lib/contracts";

// Mock data - replace with actual API calls later
const scholarships = [
  {
    id: "dummy-1",
    title: "Cloud Computing Mastery",
    sponsor: "CloudCorp",
    amount: "500",
    category: "Cloud Computing",
    skills: ["AWS", "DevOps", "Kubernetes"],
    deadline: "2024-02-28",
    description:
      "Complete AWS certification and hands-on cloud infrastructure projects.",
    totalMilestones: 3,
    milestones: [
      {
        title: "AWS Certification",
        description: "Complete AWS Cloud Practitioner Certification",
        reward: "200",
      },
      {
        title: "Infrastructure Project",
        description: "Build a scalable cloud infrastructure project",
        reward: "150",
      },
      {
        title: "DevOps Implementation",
        description: "Implement CI/CD pipeline and monitoring",
        reward: "150",
      },
    ],
  },
  {
    id: "dummy-2",
    title: "Open Source Development",
    sponsor: "GitFoundation",
    amount: "750",
    category: "Software Development",
    skills: ["Git", "JavaScript", "Open Source"],
    deadline: "2024-03-15",
    description:
      "Contribute to major open source projects and learn collaborative development.",
    totalMilestones: 3,
    milestones: [
      {
        title: "First Contribution",
        description: "Make your first open source contribution",
        reward: "250",
      },
      {
        title: "Feature Implementation",
        description: "Implement a new feature in an open source project",
        reward: "250",
      },
      {
        title: "Project Maintenance",
        description: "Help maintain an open source project",
        reward: "250",
      },
    ],
  },
  {
    id: "dummy-3",
    title: "Blockchain Development",
    sponsor: "CryptoTech",
    amount: "1000",
    category: "Blockchain",
    skills: ["Solidity", "Web3", "Smart Contracts"],
    deadline: "2024-03-30",
    description:
      "Learn blockchain development and build DApps on Ethereum network.",
    totalMilestones: 3,
    milestones: [
      {
        title: "Smart Contract Basics",
        description: "Create basic smart contracts",
        reward: "300",
      },
      {
        title: "DApp Development",
        description: "Build a decentralized application",
        reward: "400",
      },
      {
        title: "Security Implementation",
        description: "Implement security best practices",
        reward: "300",
      },
    ],
  },
];

const categories = [
  "All Categories",
  "Cloud Computing",
  "Software Development",
  "Blockchain",
  "AI/ML",
  "Cybersecurity",
];

export default function ScholarshipsPage() {
  const [realScholarships, setRealScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isConnected } = useWallet();

  useEffect(() => {
    loadRealScholarships();
  }, [isConnected]);

  const loadRealScholarships = async () => {
    try {
      setLoading(true);
      if (!isConnected) {
        setRealScholarships([]);
        return;
      }

      // Try to fetch first 10 scholarships
      const scholarshipPromises = Array.from({ length: 10 }, async (_, id) => {
        try {
          const details = await getScholarshipDetails(id);
          if (
            details &&
            details.title &&
            details.totalAmount &&
            details.isActive
          ) {
            // Transform blockchain data to match the expected format
            return {
              ...details,
              id: `real-${id}`, // Ensure unique IDs
              amount: details.totalAmount,
              skills: details.requiredSkills || [],
              milestones: Array.from(
                { length: details.totalMilestones },
                (_, i) => ({
                  title: `Milestone ${i + 1}`,
                  description: "Complete milestone requirements",
                  reward: (
                    Number(details.totalAmount) / details.totalMilestones
                  ).toString(),
                })
              ),
            };
          }
          return null;
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
          scholarship.title &&
          scholarship.amount &&
          scholarship.totalMilestones > 0
      );

      setRealScholarships(scholarshipDetails);
    } catch (error) {
      console.error("Error loading scholarships:", error);
    } finally {
      setLoading(false);
    }
  };

  // Combine dummy and real scholarships, ensuring all required fields are present
  const allScholarships = [
    ...scholarships,
    ...realScholarships.filter(
      (scholarship) =>
        scholarship &&
        scholarship.title &&
        scholarship.amount &&
        scholarship.totalMilestones > 0
    ),
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Available Scholarships</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and apply for tech-focused scholarships from leading
            companies
          </p>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Input
                placeholder="Search scholarships..."
                className="md:w-[300px]"
              />
              <Select defaultValue="All Categories">
                <SelectTrigger className="md:w-[200px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="newest">
                <SelectTrigger className="md:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="amount">Highest Amount</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Loading scholarships...</span>
            </div>
          </div>
        )}

        {/* No Scholarships State */}
        {!loading && allScholarships.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No scholarships available at the moment.
            </p>
          </div>
        )}

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allScholarships.map((scholarship) => (
            <Card
              key={scholarship.id}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">
                      {scholarship.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {scholarship.sponsor?.slice(0, 6)}...
                      {scholarship.sponsor?.slice(-4) || scholarship.sponsor}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{scholarship.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {scholarship.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {scholarship.skills?.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-primary" />
                    <span className="font-semibold">
                      {scholarship.amount} EDU
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span>{scholarship.totalMilestones} Milestones</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Deadline:{" "}
                  {scholarship.deadline instanceof Date
                    ? scholarship.deadline.toLocaleDateString()
                    : new Date(scholarship.deadline).toLocaleDateString()}
                </p>
                <ApplyDialog scholarship={scholarship} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
