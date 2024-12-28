"use client";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";  
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { CheckCircle2, Clock, FileCheck, Trophy } from "lucide-react";

// Mock data
const activeMilestones = [
  {
    id: 1,
    scholarshipId: 1,
    scholarshipTitle: "Cloud Computing Mastery",
    sponsor: "CloudCorp",
    milestone: {
      title: "Complete AWS Certified Cloud Practitioner",
      description: "Pass the certification exam and submit proof of completion",
      reward: 150,
      deadline: "2024-03-15",
      progress: 65,
      status: "in-progress",
    },
  },
  {
    id: 2,
    scholarshipId: 1,
    scholarshipTitle: "Cloud Computing Mastery",
    sponsor: "CloudCorp",
    milestone: {
      title: "Build Cloud Infrastructure Project",
      description: "Deploy a scalable web application using AWS services",
      reward: 200,
      deadline: "2024-03-30",
      progress: 25,
      status: "in-progress",
    },
  },
];

const completedMilestones = [
  {
    id: 3,
    scholarshipId: 2,
    scholarshipTitle: "Open Source Development",
    sponsor: "GitFoundation",
    milestone: {
      title: "First Open Source Contribution",
      description: "Make your first PR to a major open source project",
      reward: 100,
      completedDate: "2024-01-15",
      status: "completed",
      verificationHash: "0x123...abc",
    },
  },
];

const pendingVerification = [
  {
    id: 4,
    scholarshipId: 1,
    scholarshipTitle: "Cloud Computing Mastery",
    sponsor: "CloudCorp",
    milestone: {
      title: "AWS Architecture Design",
      description: "Design and document a scalable AWS architecture",
      reward: 175,
      submittedDate: "2024-02-01",
      status: "pending",
      proofHash: "0x456...def",
    },
  },
];

export default function MilestonesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Milestone Tracking</h1>
        <p className="text-muted-foreground">
          Track your progress and manage your scholarship milestones
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="relative">
            Active
            <Badge
              variant="secondary"
              className="ml-2 absolute -top-2 -right-2"
            >
              {activeMilestones.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending Verification
            <Badge
              variant="secondary"
              className="ml-2 absolute -top-2 -right-2"
            >
              {pendingVerification.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="relative">
            Completed
            <Badge
              variant="secondary"
              className="ml-2 absolute -top-2 -right-2"
            >
              {completedMilestones.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeMilestones.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      {item.milestone.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Trophy className="w-4 h-4" />
                      {item.scholarshipTitle} by {item.sponsor}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{item.milestone.reward} EDU</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.milestone.description}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{item.milestone.progress}%</span>
                  </div>
                  <Progress value={item.milestone.progress} />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Deadline: {item.milestone.deadline}
                    </div>
                    <Button>Submit Proof</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingVerification.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      {item.milestone.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Trophy className="w-4 h-4" />
                      {item.scholarshipTitle} by {item.sponsor}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{item.milestone.reward} EDU</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.milestone.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileCheck className="w-4 h-4" />
                    Submitted: {item.milestone.submittedDate}
                  </div>
                  <Badge variant="outline">Pending Verification</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedMilestones.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      {item.milestone.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Trophy className="w-4 h-4" />
                      {item.scholarshipTitle} by {item.sponsor}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{item.milestone.reward} EDU</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.milestone.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Completed: {item.milestone.completedDate}
                  </div>
                  <Button variant="outline" size="sm">
                    View Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
