"use client";

import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  FileCheck,
  GraduationCap,
  Users,
  Wallet,
} from "lucide-react";

// Mock sponsor data
const sponsorData = {
  name: "CloudCorp",
  totalSponsored: 2000,
  totalScholars: 12,
  verificationsPending: 4,
  stats: {
    completionRate: 85,
    averageProgress: 72,
    totalMilestones: 45,
    completedMilestones: 38,
  },
  activeScholarships: [
    {
      id: 1,
      title: "Cloud Computing Mastery",
      totalAmount: 500,
      remainingAmount: 200,
      scholars: 5,
      milestones: {
        total: 15,
        completed: 12,
        pending: 2,
      },
    },
    {
      id: 2,
      title: "DevOps Engineering",
      totalAmount: 750,
      remainingAmount: 500,
      scholars: 4,
      milestones: {
        total: 18,
        completed: 8,
        pending: 1,
      },
    },
    {
      id: 3,
      title: "AWS Architecture",
      totalAmount: 750,
      remainingAmount: 600,
      scholars: 3,
      milestones: {
        total: 12,
        completed: 3,
        pending: 1,
      },
    },
  ],
  pendingVerifications: [
    {
      id: 1,
      scholarshipTitle: "Cloud Computing Mastery",
      scholar: "Alice Johnson",
      milestone: "Deploy Scalable Architecture",
      submittedDate: "2024-02-15",
      proofHash: "0x123...abc",
    },
    {
      id: 2,
      scholarshipTitle: "DevOps Engineering",
      scholar: "Bob Smith",
      milestone: "CI/CD Pipeline Implementation",
      submittedDate: "2024-02-14",
      proofHash: "0x456...def",
    },
  ],
};

export default function SponsorDashboard() {
  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sponsor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your scholarships and track scholar progress
          </p>
        </div>
        <Button>Create New Scholarship</Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sponsored
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sponsorData.totalSponsored} EDU
            </div>
            <p className="text-xs text-muted-foreground">
              Across {sponsorData.activeScholarships.length} scholarships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Scholars
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sponsorData.totalScholars}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently enrolled scholars
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sponsorData.stats.completionRate}%
            </div>
            <Progress
              value={sponsorData.stats.completionRate}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verifications
            </CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sponsorData.verificationsPending}
            </div>
            <p className="text-xs text-muted-foreground">
              Milestones awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Scholarships */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Active Scholarships
          </CardTitle>
          <CardDescription>
            Overview of your currently active scholarship programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sponsorData.activeScholarships.map((scholarship) => (
              <div
                key={scholarship.id}
                className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-4 space-y-4 md:space-y-0"
              >
                <div>
                  <h3 className="font-medium">{scholarship.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {scholarship.scholars} Scholars
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4" />
                      {scholarship.milestones.completed} /{" "}
                      {scholarship.milestones.total} Milestones
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <Badge variant="secondary">
                    {scholarship.remainingAmount} EDU remaining
                  </Badge>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">Verify Milestones</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Verifications */}
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
          <div className="space-y-4">
            {sponsorData.pendingVerifications.map((verification) => (
              <div
                key={verification.id}
                className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-4 space-y-4 md:space-y-0"
              >
                <div>
                  <h3 className="font-medium">{verification.milestone}</h3>
                  <p className="text-sm text-muted-foreground">
                    {verification.scholarshipTitle} - {verification.scholar}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Submitted: {verification.submittedDate}
                  </div>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    View Proof
                  </Button>
                  <Button size="sm">Verify</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
