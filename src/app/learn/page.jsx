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
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Lock,
  PlayCircle,
  Users,
} from "lucide-react";
import Link from "next/link";

const courseModules = [
  {
    title: "Blockchain Basics",
    description: "Understanding the fundamentals of blockchain technology",
    lessons: [
      {
        title: "Welcome to Blockchain Basics",
        duration: "10 min",
        isCompleted: true,
        type: "video",
      },
      {
        title: "Your journey in this module",
        duration: "15 min",
        isCompleted: true,
        type: "reading",
      },
      {
        title: "Hashing the data",
        duration: "20 min",
        isCompleted: false,
        type: "video",
      },
      {
        title: "Hashing the data - Demo",
        duration: "25 min",
        isCompleted: false,
        type: "interactive",
      },
      {
        title: "Block of data",
        duration: "15 min",
        isCompleted: false,
        type: "video",
      },
      {
        title: "Block of data - Demo",
        duration: "20 min",
        isCompleted: false,
        type: "interactive",
      },
      {
        title: "Chaining the blocks",
        duration: "25 min",
        isCompleted: false,
        type: "video",
      },
      {
        title: "Chaining the blocks - Demo",
        duration: "30 min",
        isCompleted: false,
        type: "interactive",
      },
      {
        title: "Single chains",
        duration: "15 min",
        isCompleted: false,
        type: "video",
      },
      {
        title: "Distributed chains",
        duration: "20 min",
        isCompleted: false,
        type: "video",
      },
    ],
  },
  {
    title: "Mining and Consensus",
    description: "Learn about blockchain mining and consensus mechanisms",
    lessons: [
      {
        title: "Making the longest chain the 'true' blockchain",
        duration: "20 min",
        isCompleted: false,
        type: "video",
        isLocked: true,
      },
      {
        title: "A time-consuming puzzle",
        duration: "25 min",
        isCompleted: false,
        type: "video",
        isLocked: true,
      },
      {
        title: "Multiple computers working on the puzzle",
        duration: "15 min",
        isCompleted: false,
        type: "video",
        isLocked: true,
      },
      {
        title: "Solving the puzzle: Mining",
        duration: "30 min",
        isCompleted: false,
        type: "video",
        isLocked: true,
      },
      {
        title: "Solving the puzzle: Mining - Demo",
        duration: "35 min",
        isCompleted: false,
        type: "interactive",
        isLocked: true,
      },
    ],
  },
];

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Course Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 bg-muted p-6 rounded-lg">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">
              Transition to Web3 - Course 1
            </h1>
            <p className="text-xl text-muted-foreground">Blockchain Basics</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>4 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>12,867+ enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span>Certificate</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Progress value={20} className="w-[200px]" />
            <span className="text-sm text-muted-foreground">20% Complete</span>
          </div>
        </div>

        {/* Course Content */}
        <div className="space-y-8">
          {courseModules.map((module, moduleIndex) => (
            <Card key={moduleIndex}>
              <CardHeader>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      lesson.isLocked ? "opacity-50" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {lesson.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : lesson.isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : lesson.type === "video" ? (
                        <PlayCircle className="w-5 h-5" />
                      ) : lesson.type === "reading" ? (
                        <BookOpen className="w-5 h-5" />
                      ) : (
                        <GraduationCap className="w-5 h-5" />
                      )}
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {lesson.duration} • {lesson.type}
                        </p>
                      </div>
                    </div>
                    {!lesson.isLocked && (
                      <Button
                        variant={lesson.isCompleted ? "outline" : "default"}
                      >
                        {lesson.isCompleted ? "Review" : "Start"}
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Course Description */}
        <Card>
          <CardHeader>
            <CardTitle>About this course</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We will start with the fundamentals of blockchain technology, and
              understand what a blockchain is and how it works. In the end, you
              will have an intuitive understanding of hashes, blocks,
              blockchain, mining, proof-of-work consensus algorithm, and why a
              blockchain is a reliable, decentralized system.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Join 12,867+ learners</span>
            </div>
            <Button>Continue Learning</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
