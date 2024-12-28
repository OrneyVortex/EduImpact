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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const { connect, disconnect, isConnected, address, hasProfile, profile } =
    useWallet();
  const router = useRouter();

  const navigation = [
    { name: "Explore", href: "/explore", icon: Book },
    { name: "Scholarships", href: "/scholarships", icon: Trophy },
    { name: "Learn", href: "/learn", icon: GraduationCap },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <span className="font-bold text-xl">EduImpact</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/sponsor/dashboard">
            <Button
              variant="outline"
              className="hidden sm:flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Sparkles className="h-4 w-4" />
              Are you a Sponsor?
            </Button>
          </Link>

          {!isConnected ? (
            <Button onClick={connect} className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          ) : !hasProfile ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Create Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
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
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sponsor/dashboard" className="cursor-pointer">
                      <Trophy className="mr-2 h-4 w-4" />
                      Sponsor Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/scholar/dashboard" className="cursor-pointer">
                      <Book className="mr-2 h-4 w-4" />
                      Scholar Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={disconnect}
                    className="text-red-600 cursor-pointer"
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
