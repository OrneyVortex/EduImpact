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
  ArrowRight,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const StatCard = ({ icon: Icon, value, label }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  return (
    <motion.div ref={ref} style={{ opacity, scale }}>
      <Card className="group hover-effect">
        <CardHeader className="text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardTitle className="relative">
            <Icon className="w-8 h-8 mx-auto text-primary mb-2 transition-transform group-hover:scale-110" />
            <motion.span
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {value}
            </motion.span>
          </CardTitle>
          <CardDescription className="font-medium">{label}</CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="max-w-7xl mx-auto space-y-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section */}
        <section className="text-center space-y-6 relative py-12">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-gradient" />
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          </div>

          <motion.div variants={itemVariants}>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 inline-block mb-4">
              Discover Opportunities
            </span>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
          >
            Explore Learning Opportunities
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Discover scholarships, build skills, and earn rewards while learning
            from industry experts
          </motion.p>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={Trophy} value="50+" label="Active Scholarships" />
          <StatCard icon={Users} value="1000+" label="Registered Scholars" />
          <StatCard icon={Briefcase} value="25+" label="Partner Companies" />
          <StatCard icon={TrendingUp} value="50,000" label="EDU Distributed" />
        </section>

        {/* Main Content Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="featured" className="space-y-6">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 p-1 glass-effect">
              <TabsTrigger
                value="featured"
                className="data-[state=active]:bg-primary/10"
              >
                Featured Scholarships
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="data-[state=active]:bg-primary/10"
              >
                Top Categories
              </TabsTrigger>
              <TabsTrigger
                value="success"
                className="data-[state=active]:bg-primary/10"
              >
                Success Stories
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-primary/10"
              >
                Upcoming Programs
              </TabsTrigger>
            </TabsList>

            {/* Featured Scholarships */}
            <TabsContent value="featured">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredScholarships.map((scholarship, index) => (
                  <motion.div
                    key={scholarship.id}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={index}
                  >
                    <Card className="group hover-effect h-full flex flex-col">
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
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary border-primary/20"
                          >
                            {scholarship.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {scholarship.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {scholarship.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="gradient-border"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {scholarship.applicants} applicants
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {new Date(
                              scholarship.deadline
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center pt-4 border-t">
                        <div className="font-semibold text-primary">
                          {scholarship.amount}
                        </div>
                        <Button className="group" variant="ghost">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Top Categories */}
            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {topCategories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={index}
                  >
                    <Card className="group hover-effect">
                      <CardHeader>
                        <div className="relative inline-block mb-4">
                          <category.icon className="w-12 h-12 text-primary" />
                          <motion.div
                            initial={false}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              repeatDelay: 3,
                            }}
                            className="absolute -inset-2 rounded-full bg-primary/20 blur-sm -z-10"
                          />
                        </div>
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>
                          {category.scholarships} scholarships available
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          Average reward: {category.avgReward}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Success Stories */}
            <TabsContent value="success">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {successStories.map((story, index) => (
                  <motion.div
                    key={story.name}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={index}
                  >
                    <Card className="group hover-effect">
                      <CardHeader>
                        <CardTitle className="text-lg">{story.name}</CardTitle>
                        <Badge className="bg-primary/10 text-primary border-primary/20 mt-2">
                          {story.achievement}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {story.description}
                        </p>
                        <div className="text-sm font-medium text-primary">
                          Earned: {story.reward}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming">
              <div className="text-center py-12">
                <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  New learning opportunities are being added regularly. Check
                  back soon!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
