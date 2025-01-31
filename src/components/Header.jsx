"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useWallet } from "../lib/WalletContext";
import CreateProfile from "./CreateProfile";
import {
  ChevronDown,
  User,
  Wallet,
  LogOut,
  Book,
  Trophy,
  GraduationCap,
  Sparkles,
  Lightbulb,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const { connect, disconnect, isConnected, address, hasProfile, profile } =
    useWallet();
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    { name: "Explore", href: "/explore", icon: Book },
    { name: "Scholarships", href: "/scholarships", icon: Trophy },
    { name: "Learn", href: "/learn", icon: GraduationCap },
    { name: "Milestones", href: "/milestones", icon: Target },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className=" flex h-16 items-center justify-around ">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center hover-effect">
            <div className="relative">
              <GraduationCap className="h-6 w-6 text-primary" />
              <div className="absolute -inset-1 rounded-full bg-primary/20 blur-sm" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              EduImpact
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
                    "relative py-2",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isActive && "scale-110"
                    )}
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute -bottom-px left-0 h-px w-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/sponsor/dashboard">
            <Button
              variant="outline"
              className="hidden sm:flex items-center gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10 text-primary transition-all duration-300"
            >
              <div className="relative">
                <Sparkles className="h-4 w-4" />
                <div className="absolute -inset-1 rounded-full bg-primary/20 animate-pulse blur-sm" />
              </div>
              Are you a Sponsor?
            </Button>
          </Link>

          {!isConnected ? (
            <Button
              onClick={connect}
              className="flex items-center gap-2 hover-effect bg-primary/90 hover:bg-primary"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          ) : !hasProfile ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 hover-effect">
                  <User className="h-4 w-4" />
                  Create Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-effect">
                <DialogHeader>
                  <DialogTitle>OpenCampus ID Required</DialogTitle>
                  <DialogDescription>
                    You need an OpenCampus ID to use EduImpact
                  </DialogDescription>
                </DialogHeader>
                <CreateProfile />
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover-effect gradient-border"
                  >
                    <User className="h-4 w-4 text-primary" />
                    <span className="hidden sm:inline">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-effect">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="cursor-pointer hover-effect"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/sponsor/dashboard"
                      className="cursor-pointer hover-effect"
                    >
                      <Trophy className="mr-2 h-4 w-4" />
                      Sponsor Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/scholar/dashboard"
                      className="cursor-pointer hover-effect"
                    >
                      <Book className="mr-2 h-4 w-4" />
                      Scholar Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={disconnect}
                    className="text-destructive hover:text-destructive/90 cursor-pointer hover-effect"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
