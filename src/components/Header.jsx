"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/lib/WalletContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Trophy,
  User,
  Wallet,
} from "lucide-react";

const navigation = [
  {
    name: "Scholarships",
    href: "/scholarships",
    icon: BookOpen,
  },
  {
    name: "Milestones",
    href: "/milestones",
    icon: Trophy,
  },
  {
    name: "Learn",
    href: "/learn",
    icon: GraduationCap,
  },
];

const sponsorNavigation = [
  {
    name: "Dashboard",
    href: "/sponsor/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Create Scholarship",
    href: "/sponsor/create",
    icon: BookOpen,
  },
];

export default function Header() {
  const pathname = usePathname();
  const { isConnected, address, connect, disconnect } = useWallet();

  const isSponsorRoute = pathname.startsWith("/sponsor");
  const activeNavigation = isSponsorRoute ? sponsorNavigation : navigation;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">EduImpact</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {activeNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            {activeNavigation.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline-block">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex w-full items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {!isSponsorRoute && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/sponsor/dashboard"
                        className="flex w-full items-center gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Sponsor Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-red-600"
                    onClick={disconnect}
                  >
                    <LogOut className="h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={connect} size="sm" className="gap-2">
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
