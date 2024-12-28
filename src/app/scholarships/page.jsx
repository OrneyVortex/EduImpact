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

// Mock data - replace with actual API calls later
const scholarships = [
  {
    id: 1,
    title: "Cloud Computing Mastery",
    sponsor: "CloudCorp",
    amount: "500",
    category: "Cloud Computing",
    skills: ["AWS", "DevOps", "Kubernetes"],
    deadline: "2024-02-28",
    description:
      "Complete AWS certification and hands-on cloud infrastructure projects.",
  },
  {
    id: 2,
    title: "Open Source Development",
    sponsor: "GitFoundation",
    amount: "750",
    category: "Software Development",
    skills: ["Git", "JavaScript", "Open Source"],
    deadline: "2024-03-15",
    description:
      "Contribute to major open source projects and learn collaborative development.",
  },
  {
    id: 3,
    title: "Blockchain Development",
    sponsor: "CryptoTech",
    amount: "1000",
    category: "Blockchain",
    skills: ["Solidity", "Web3", "Smart Contracts"],
    deadline: "2024-03-30",
    description:
      "Learn blockchain development and build DApps on Ethereum network.",
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
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Available Scholarships</h1>
        <p className="text-muted-foreground">
          Discover and apply for tech-focused scholarships from leading
          companies
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input placeholder="Search scholarships..." className="md:w-[300px]" />
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

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scholarships.map((scholarship) => (
          <Card key={scholarship.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{scholarship.title}</CardTitle>
                <Badge variant="secondary">{scholarship.category}</Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {scholarship.sponsor}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {scholarship.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {scholarship.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="font-semibold">${scholarship.amount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span>3 Milestones</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
              </p>
              <ApplyDialog scholarship={scholarship} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
