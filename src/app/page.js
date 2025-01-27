"use client";

import { Button } from "../components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Trophy,
  Users,
  Wallet,
  GraduationCap,
  Code,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Open Campus ID",
    description:
      "Manage your decentralized identity and credentials securely on the blockchain",
    icon: GraduationCap,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Milestone-Based Funding",
    description: "Earn rewards as you complete technical learning milestones",
    icon: Trophy,
    color: "from-amber-500/20 to-yellow-500/20",
  },
  {
    title: "Corporate Sponsorships",
    description:
      "Connect with tech companies funding the next generation of innovators",
    icon: Users,
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    title: "Tech-Focused Learning",
    description:
      "Access curated resources for programming, cloud computing, and more",
    icon: Code,
    color: "from-purple-500/20 to-violet-500/20",
  },
  {
    title: "NFT Recognition",
    description: "Earn verifiable badges for your technical achievements",
    icon: Wallet,
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    title: "Community Learning",
    description: "Participate in hackathons, workshops, and tech communities",
    icon: BookOpen,
    color: "from-indigo-500/20 to-blue-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="min-h-[90vh] relative flex items-center justify-center py-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 animate-gradient" />
          <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container px-4 text-center relative"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-block"
          >
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
              Welcome to the Future of Tech Education
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
          >
            Empowering Tech Innovators Through{" "}
            <span className="relative">
              Decentralized
              <motion.div
                className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
            </span>{" "}
            Scholarships
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Access funding, build skills, and earn rewards while contributing to
            the tech ecosystem
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex gap-4 justify-center"
          >
            <Link href="/scholarships">
              <Button size="lg" className="group hover-effect">
                Explore Scholarships
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="group hover-effect gradient-border"
              >
                Learn More
                <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="container mx-auto px-4"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-4"
          >
            Why Choose EduImpact?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto"
          >
            Experience the future of tech education with our innovative platform
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                <div
                  className={`p-6 h-full rounded-2xl bg-gradient-to-r ${feature.color} glass-effect card-shadow`}
                >
                  <div className="relative inline-block">
                    <feature.icon className="w-12 h-12 text-primary mb-4" />
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
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="container relative mx-auto px-4 text-center text-primary-foreground"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Start Your Tech Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join EduImpact today and unlock opportunities in the tech world
          </p>
          <Link href="/scholarships">
            <Button
              size="lg"
              variant="secondary"
              className="group bg-white text-primary hover:bg-white/90 hover-effect"
            >
              Get Started
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowRight className="ml-2 h-4 w-4" />
              </motion.div>
            </Button>
          </Link>

          {/* Decorative elements */}
          <div className="absolute top-1/2 left-10 w-20 h-20 border-4 border-white/20 rounded-full animate-spin-slow" />
          <div className="absolute bottom-10 right-10 w-32 h-32 border-8 border-white/10 rounded-full animate-spin-slow animation-delay-2000" />
        </motion.div>
      </section>
    </div>
  );
}
