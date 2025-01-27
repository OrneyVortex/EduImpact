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
import {
  Coins,
  Users,
  Trophy,
  Search,
  Filter,
  Clock,
  ArrowRight,
  Sparkles,
  Target,
} from "lucide-react";
import ApplyDialog from "../../components/scholarships/ApplyDialog";
import { useState, useEffect } from "react";
import { useWallet } from "../../lib/WalletContext";
import { getScholarshipDetails } from "../../lib/contracts";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ScholarshipsPage() {
  const [realScholarships, setRealScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isConnected } = useWallet();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("newest");

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

  // Combine and filter scholarships
  const filteredScholarships = [...scholarships, ...realScholarships]
    .filter(
      (scholarship) =>
        scholarship &&
        scholarship.title &&
        scholarship.amount &&
        scholarship.totalMilestones > 0 &&
        (searchTerm === "" ||
          scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          scholarship.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) &&
        (selectedCategory === "All Categories" ||
          scholarship.category === selectedCategory)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "amount":
          return parseInt(b.amount) - parseInt(a.amount);
        case "deadline":
          return new Date(a.deadline) - new Date(b.deadline);
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto px-4 py-12">
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
              Find Your Next Opportunity
            </span>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
          >
            Available Scholarships
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Discover and apply for tech-focused scholarships from leading
            companies
          </motion.p>
        </section>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm glass-effect">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <div className="relative md:w-[300px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search scholarships..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="md:w-[200px]">
                    <Filter className="mr-2 h-4 w-4" />
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
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="md:w-[200px]">
                    <Target className="mr-2 h-4 w-4" />
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
        </motion.div>

        {/* Scholarships Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            key={searchTerm + selectedCategory + sortBy}
          >
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  variants={itemVariants}
                  className="animate-pulse"
                >
                  <Card className="h-[400px] bg-muted/5" />
                </motion.div>
              ))
            ) : filteredScholarships.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="col-span-full text-center py-12"
              >
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Scholarships Found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or check back later for new
                  opportunities
                </p>
              </motion.div>
            ) : (
              filteredScholarships.map((scholarship, index) => (
                <motion.div key={scholarship.id} variants={itemVariants} layout>
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
                          <Target className="w-4 h-4" />
                          {scholarship.totalMilestones} milestones
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(scholarship.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-primary">
                          {scholarship.amount} EDU
                        </span>
                      </div>
                      <ApplyDialog scholarship={scholarship}>
                        <Button className="group" variant="ghost">
                          Apply Now
                          <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                        </Button>
                      </ApplyDialog>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
