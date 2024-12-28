"use client";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Award,
  BookOpen,
  Code2,
  GraduationCap,
  Trophy,
  User,
  Wallet,
} from "lucide-react";

// Mock user data
const userData = {
  ocid: "OCID-123456",
  name: "John Doe",
  ethAddress: "0x1234...5678",
  reputation: 75,
  level: "Intermediate",
  totalEarned: 450,
  skills: [
    { name: "JavaScript", verified: true },
    { name: "React", verified: true },
    { name: "AWS", verified: true },
    { name: "Node.js", verified: false },
    { name: "Solidity", verified: false },
  ],
  achievements: [
    {
      id: 1,
      title: "First Milestone Completed",
      description: "Completed your first scholarship milestone",
      date: "2024-01-15",
      type: "milestone",
    },
    {
      id: 2,
      title: "Skill Verified",
      description: "JavaScript skill verified by CloudCorp",
      date: "2024-01-20",
      type: "skill",
    },
  ],
  activeScholarships: [
    {
      id: 1,
      title: "Cloud Computing Mastery",
      sponsor: "CloudCorp",
      progress: 65,
      milestonesCompleted: 2,
      totalMilestones: 3,
    },
  ],
  completedScholarships: [
    {
      id: 2,
      title: "Web Development Fundamentals",
      sponsor: "TechEdu",
      completedDate: "2024-01-10",
      earnedAmount: 300,
    },
  ],
};

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile, track achievements, and view your progress
          </p>
        </div>
        <Button>Edit Profile</Button>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Open Campus ID</p>
              <p className="font-medium">{userData.ocid}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ETH Address</p>
              <p className="font-medium">{userData.ethAddress}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Reputation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{userData.level}</span>
                <span>{userData.reputation} Points</span>
              </div>
              <Progress value={userData.reputation} />
            </div>
            <Badge variant="secondary" className="text-xs">
              Next Level: 100 Points
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {userData.totalEarned} EDU
            </div>
            <p className="text-sm text-muted-foreground">
              Total earned from scholarships
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Skills and Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              Technical Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill) => (
                <Badge
                  key={skill.name}
                  variant={skill.verified ? "default" : "outline"}
                  className="flex items-center gap-1"
                >
                  {skill.name}
                  {skill.verified && <Award className="w-3 h-3" />}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userData.achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-3">
                  {achievement.type === "milestone" ? (
                    <Trophy className="w-5 h-5 text-primary mt-1" />
                  ) : (
                    <Award className="w-5 h-5 text-primary mt-1" />
                  )}
                  <div>
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {achievement.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scholarships */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            My Scholarships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {userData.activeScholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div>
                    <h3 className="font-medium">{scholarship.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Sponsored by {scholarship.sponsor}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <Trophy className="w-4 h-4" />
                      {scholarship.milestonesCompleted} of{" "}
                      {scholarship.totalMilestones} milestones completed
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm mb-2">
                      {scholarship.progress}% Complete
                    </div>
                    <Progress
                      value={scholarship.progress}
                      className="w-[200px]"
                    />
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {userData.completedScholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div>
                    <h3 className="font-medium">{scholarship.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Sponsored by {scholarship.sponsor}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Completed on {scholarship.completedDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">
                      Earned {scholarship.earnedAmount} EDU
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
