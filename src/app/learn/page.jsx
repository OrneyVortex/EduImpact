"use client";

import { useState } from "react";
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
  ArrowRight,
  Trophy,
  Star,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

const ProgressRing = ({ progress }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90 w-20 h-20">
        <circle
          className="text-muted stroke-current"
          strokeWidth="4"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
        <circle
          className="text-primary stroke-current transition-all duration-500 ease-in-out"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-lg font-bold">{progress}%</span>
      </div>
    </div>
  );
};

export default function LearnPage() {
  // Calculate initial completed lessons and progress
  const [completedLessons, setCompletedLessons] = useState(() => {
    // Get all initially completed lessons
    const completed = new Set();
    courseModules.forEach((module, moduleIndex) => {
      module.lessons.forEach((lesson, lessonIndex) => {
        if (lesson.isCompleted) {
          // Use a unique identifier for each lesson
          completed.add(`${moduleIndex}-${lessonIndex}`);
        }
      });
    });
    return completed;
  });

  // Calculate initial progress
  const [courseProgress, setCourseProgress] = useState(() => {
    const totalLessons = courseModules.reduce(
      (total, module) => total + module.lessons.length,
      0
    );
    return Math.round((completedLessons.size / totalLessons) * 100);
  });

  const handleLessonStart = (moduleIndex, lessonIndex) => {
    const lessonKey = `${moduleIndex}-${lessonIndex}`;
    if (!completedLessons.has(lessonKey)) {
      const newCompletedLessons = new Set(completedLessons);
      newCompletedLessons.add(lessonKey);
      setCompletedLessons(newCompletedLessons);

      // Calculate total lessons
      const totalLessons = courseModules.reduce(
        (total, module) => total + module.lessons.length,
        0
      );

      // Calculate new progress
      const newProgress = Math.min(
        100,
        Math.round((newCompletedLessons.size / totalLessons) * 100)
      );
      setCourseProgress(newProgress);
    }
  };

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
              Course 1
            </span>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
          >
            Transition to Web3
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Master blockchain fundamentals and start your Web3 journey
          </motion.p>
        </section>

        {/* Course Stats */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm glass-effect">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center justify-center">
                  <ProgressRing progress={courseProgress} />
                  <span className="mt-2 text-sm text-muted-foreground">
                    Course Progress
                  </span>
                </div>
                <div className="flex items-center gap-4 justify-center">
                  <Clock className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-lg font-semibold">4 hours</p>
                    <p className="text-sm text-muted-foreground">
                      Total Duration
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-center">
                  <Users className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-lg font-semibold">12,867+</p>
                    <p className="text-sm text-muted-foreground">
                      Students Enrolled
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-center">
                  <Trophy className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-lg font-semibold">Certificate</p>
                    <p className="text-sm text-muted-foreground">
                      Upon Completion
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Course Content */}
        <motion.div variants={itemVariants} className="space-y-6">
          {courseModules.map((module, moduleIndex) => (
            <motion.div
              key={moduleIndex}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              className="group"
            >
              <Card className="hover-effect">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {module.title}
                      </CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                    <Star className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {module.lessons.map((lesson, lessonIndex) => (
                      <motion.div
                        key={lessonIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            lesson.isLocked
                              ? "opacity-50"
                              : "hover:bg-primary/5 hover:border-primary/20 transition-colors"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              {completedLessons.has(
                                `${moduleIndex}-${lessonIndex}`
                              ) ? (
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
                              {!lesson.isLocked &&
                                !completedLessons.has(
                                  `${moduleIndex}-${lessonIndex}`
                                ) && (
                                  <motion.div
                                    className="absolute -inset-1 rounded-full bg-primary/20 -z-10"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                    }}
                                  />
                                )}
                            </div>
                            <div>
                              <p className="font-medium">{lesson.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {lesson.duration} • {lesson.type}
                              </p>
                            </div>
                          </div>
                          {!lesson.isLocked && (
                            <Button
                              variant="ghost"
                              className="group"
                              onClick={() =>
                                handleLessonStart(moduleIndex, lessonIndex)
                              }
                            >
                              {completedLessons.has(
                                `${moduleIndex}-${lessonIndex}`
                              )
                                ? "Review"
                                : "Start"}
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
