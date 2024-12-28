"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useToast } from "../hooks/use-toast";

export default function Header() {
  const [account, setAccount] = useState("");
  const { toast } = useToast();

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to MetaMask",
        });
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to use this platform",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Check if already connected
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });
    }
  }, []);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold">
              EduImpact
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/scholarships"
                className="text-gray-600 hover:text-gray-900"
              >
                Scholarships
              </Link>
              <Link
                href="/milestones"
                className="text-gray-600 hover:text-gray-900"
              >
                Milestones
              </Link>
              {account && (
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Profile
                </Link>
              )}
            </div>
          </div>
          <div>
            {!account ? (
              <Button onClick={connectWallet}>Connect Wallet</Button>
            ) : (
              <Button variant="outline">
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
