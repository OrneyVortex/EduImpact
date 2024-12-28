"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { connectWallet } from "./contracts";
import { useToast } from "../hooks/use-toast";

const WalletContext = createContext({
  isConnected: false,
  address: null,
  connect: async () => {},
  disconnect: () => {},
  error: null,
});

export function WalletProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === "undefined") {
      setError("Please install MetaMask to use this application");
      return;
    }

    // Listen for account changes
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // Check if already connected
    checkConnection();

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const checkConnection = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error checking connection:", err);
      setError(err.message);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected
      setIsConnected(false);
      setAddress(null);
      toast({
        title: "Wallet Disconnected",
        description: "Please connect your wallet to continue.",
        variant: "destructive",
      });
    } else {
      // User switched accounts
      setAddress(accounts[0]);
      setIsConnected(true);
      toast({
        title: "Account Changed",
        description: `Connected to ${accounts[0].slice(
          0,
          6
        )}...${accounts[0].slice(-4)}`,
      });
    }
  };

  const handleChainChanged = () => {
    // Reload the page when the chain changes
    window.location.reload();
  };

  const connect = async () => {
    try {
      const { signer } = await connectWallet();
      const address = await signer.getAddress();
      setAddress(address);
      setIsConnected(true);
      setError(null);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(
          -4
        )}`,
      });
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError(err.message);
      toast({
        title: "Connection Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from wallet.",
    });
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        connect,
        disconnect,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
