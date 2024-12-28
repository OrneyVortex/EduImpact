import Link from "next/link";
import { Button } from "../components/ui/button";
import {
  BookOpen,
  GraduationCap,
  Trophy,
  Users,
  Wallet,
  Building2,
} from "lucide-react";

const features = [
  {
    name: "Learn & Earn",
    description:
      "Complete milestones in your learning journey and earn EDU tokens as rewards for your progress.",
    icon: GraduationCap,
  },
  {
    name: "Corporate Sponsorships",
    description:
      "Connect with leading tech companies offering sponsored learning paths and job opportunities.",
    icon: Building2,
  },
  {
    name: "Verified Achievements",
    description:
      "Showcase your skills with blockchain-verified credentials and build your tech reputation.",
    icon: Trophy,
  },
  {
    name: "Community Learning",
    description:
      "Join a community of learners and mentors, sharing knowledge and growing together.",
    icon: Users,
  },
];

export default function Home() {
  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Learn, Earn & Build Your Tech Career
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            EduImpact is a decentralized platform that connects tech learners
            with corporate sponsors, providing incentivized learning paths and
            blockchain-verified credentials.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/scholarships">
              <Button size="lg" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Browse Scholarships
              </Button>
            </Link>
            <Link href="/sponsor/dashboard">
              <Button variant="outline" size="lg" className="gap-2">
                <Wallet className="h-4 w-4" />
                Become a Sponsor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose EduImpact?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our platform combines blockchain technology with education to
              create a transparent and rewarding learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative border rounded-lg p-8 hover:border-foreground/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.name}</h3>
                </div>
                <p className="mt-4 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join EduImpact today and unlock opportunities to learn from industry
            experts, earn rewards, and build your career in tech.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/scholarships">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/learn">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
