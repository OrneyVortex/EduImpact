"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Trophy,
  Users,
  Rocket,
  Target,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Brain,
  Cloud,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Mock data for featured content
const featuredScholarships = [
  {
    id: 1,
    title: "Web3 Development",
    sponsor: "BlockchainCo",
    amount: "1500 EDU",
    applicants: 45,
    deadline: "2024-03-15",
    category: "Blockchain",
    skills: ["Solidity", "Web3.js", "Smart Contracts"],
    description:
      "Learn blockchain development and create decentralized applications on Ethereum.",
    milestones: [
      {
        title: "Smart Contract Basics",
        reward: "500 EDU",
      },
      {
        title: "DApp Development",
        reward: "500 EDU",
      },
      {
        title: "Security & Testing",
        reward: "500 EDU",
      },
    ],
  },
  {
    id: 2,
    title: "AI Research Program",
    sponsor: "TechGiants",
    amount: "2000 EDU",
    applicants: 67,
    deadline: "2024-03-20",
    category: "Artificial Intelligence",
    skills: ["Python", "TensorFlow", "Machine Learning"],
    description:
      "Conduct research in machine learning and develop innovative AI solutions.",
    milestones: [
      {
        title: "Research Proposal",
        reward: "500 EDU",
      },
      {
        title: "Model Development",
        reward: "750 EDU",
      },
      {
        title: "Paper Publication",
        reward: "750 EDU",
      },
    ],
  },
  {
    id: 3,
    title: "Cloud Architecture",
    sponsor: "CloudMasters",
    amount: "1200 EDU",
    applicants: 32,
    deadline: "2024-03-25",
    category: "Cloud Computing",
    skills: ["AWS", "Docker", "Kubernetes"],
    description:
      "Master cloud infrastructure and deploy scalable applications.",
    milestones: [
      {
        title: "Cloud Fundamentals",
        reward: "400 EDU",
      },
      {
        title: "Container Orchestration",
        reward: "400 EDU",
      },
      {
        title: "Production Deployment",
        reward: "400 EDU",
      },
    ],
  },
];

const topCategories = [
  {
    name: "Blockchain",
    icon: Rocket,
    scholarships: 24,
    avgReward: "1200 EDU",
  },
  {
    name: "Artificial Intelligence",
    icon: Brain,
    scholarships: 18,
    avgReward: "1500 EDU",
  },
  {
    name: "Cloud Computing",
    icon: Cloud,
    scholarships: 15,
    avgReward: "1000 EDU",
  },
  {
    name: "Cybersecurity",
    icon: Shield,
    scholarships: 12,
    avgReward: "1300 EDU",
  },
];

const successStories = [
  {
    name: "Alex Chen",
    achievement: "Completed Cloud Architecture Scholarship",
    reward: "1500 EDU",
    description:
      "Built a scalable cloud infrastructure and landed a job at AWS.",
  },
  {
    name: "Sarah Johnson",
    achievement: "Web3 Development Program Graduate",
    reward: "2000 EDU",
    description:
      "Developed a DeFi application and started her own Web3 company.",
  },
  {
    name: "Mike Rodriguez",
    achievement: "AI Research Scholar",
    reward: "1800 EDU",
    description: "Published a research paper on machine learning optimization.",
  },
];

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Explore Learning Opportunities</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover scholarships, build skills, and earn rewards while learning
            from industry experts
          </p>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>
                <Trophy className="w-8 h-8 mx-auto text-primary mb-2" />
                <span className="text-2xl font-bold">50+</span>
              </CardTitle>
              <CardDescription>Active Scholarships</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <CardTitle>
                <Users className="w-8 h-8 mx-auto text-primary mb-2" />
                <span className="text-2xl font-bold">1000+</span>
              </CardTitle>
              <CardDescription>Registered Scholars</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <CardTitle>
                <Briefcase className="w-8 h-8 mx-auto text-primary mb-2" />
                <span className="text-2xl font-bold">25+</span>
              </CardTitle>
              <CardDescription>Partner Companies</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <CardTitle>
                <TrendingUp className="w-8 h-8 mx-auto text-primary mb-2" />
                <span className="text-2xl font-bold">50,000</span>
              </CardTitle>
              <CardDescription>EDU Distributed</CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* Main Content Tabs */}
        <Tabs defaultValue="featured" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="featured">Featured Scholarships</TabsTrigger>
            <TabsTrigger value="categories">Top Categories</TabsTrigger>
            <TabsTrigger value="success">Success Stories</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Programs</TabsTrigger>
          </TabsList>

          {/* Featured Scholarships */}
          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredScholarships.map((scholarship) => (
                <Card key={scholarship.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle className="text-xl mb-1">
                          {scholarship.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Sponsored by {scholarship.sponsor}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{scholarship.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {scholarship.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {scholarship.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Total Reward:
                        </span>
                        <span className="font-semibold text-primary">
                          {scholarship.amount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Applicants:
                        </span>
                        <span>{scholarship.applicants}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Deadline:
                        </span>
                        <span>
                          {new Date(scholarship.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Milestones</span>
                      </div>
                      <div className="space-y-1">
                        {scholarship.milestones.map((milestone, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {milestone.title}
                            </span>
                            <span>{milestone.reward}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button asChild className="w-full">
                      <Link href={`/scholarships/${scholarship.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories */}
          <TabsContent value="categories">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topCategories.map((category, index) => (
                <Card
                  key={index}
                  className="hover:border-primary transition-colors cursor-pointer"
                >
                  <CardHeader>
                    <category.icon className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Active Scholarships:</span>
                        <span>{category.scholarships}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg. Reward:</span>
                        <span>{category.avgReward}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Success Stories */}
          <TabsContent value="success">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {successStories.map((story, index) => (
                <Card key={index}>
                  <CardHeader>
                    <GraduationCap className="w-8 h-8 text-primary mb-2" />
                    <CardTitle>{story.name}</CardTitle>
                    <CardDescription>{story.achievement}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {story.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span>Earned:</span>
                      <span className="font-semibold">{story.reward}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Upcoming Programs */}
          <TabsContent value="upcoming">
            <div className="text-center py-12">
              <Target className="w-12 h-12 mx-auto text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2">Coming Soon!</h3>
              <p className="text-muted-foreground mb-6">
                We're preparing exciting new learning programs. Stay tuned!
              </p>
              <Button asChild>
                <Link href="/scholarships">Browse Current Scholarships</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <section className="text-center py-12 bg-muted rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join our community of learners and earn while you learn. Apply for
            scholarships, complete milestones, and build your career in tech.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/scholarships">Browse Scholarships</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/sponsor/create">Become a Sponsor</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
