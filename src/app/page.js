import { Button } from "../components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  Trophy,
  Users,
  Wallet,
  GraduationCap,
  Code,
} from "lucide-react";

const features = [
  {
    title: "Open Campus ID",
    description:
      "Manage your decentralized identity and credentials securely on the blockchain",
    icon: GraduationCap,
  },
  {
    title: "Milestone-Based Funding",
    description: "Earn rewards as you complete technical learning milestones",
    icon: Trophy,
  },
  {
    title: "Corporate Sponsorships",
    description:
      "Connect with tech companies funding the next generation of innovators",
    icon: Users,
  },
  {
    title: "Tech-Focused Learning",
    description:
      "Access curated resources for programming, cloud computing, and more",
    icon: Code,
  },
  {
    title: "NFT Recognition",
    description: "Earn verifiable badges for your technical achievements",
    icon: Wallet,
  },
  {
    title: "Community Learning",
    description: "Participate in hackathons, workshops, and tech communities",
    icon: BookOpen,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Empowering Tech Innovators Through{" "}
          <span className="text-primary">Decentralized Scholarships</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Access funding, build skills, and earn rewards while contributing to
          the tech ecosystem
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/scholarships">
            <Button size="lg">Explore Scholarships</Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose EduImpact?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-background rounded-lg shadow-sm"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Tech Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join EduImpact today and unlock opportunities in the tech world
          </p>
          <Link href="/scholarships">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
