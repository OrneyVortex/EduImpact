"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  connectWallet,
  hasActiveProfile,
  getProfile,
  ocidAuth,
} from "./contracts";
import { useToast } from "../hooks/use-toast";

const WalletContext = createContext({
  isConnected: false,
  address: null,
  connect: async () => {},
  disconnect: () => {},
  error: null,
  profile: null,
  hasProfile: false,
  loadProfile: async () => {},
  redirectToOCID: () => {},
});

export function WalletProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const { toast } = useToast();

  const redirectToOCID = async () => {
    try {
      await ocidAuth.signInWithRedirect({
        state: "eduimpact",
        redirectUri: window.location.origin + "/redirect",
      });
    } catch (err) {
      console.error("Error redirecting to OCID:", err);
      toast({
        title: "Error",
        description: "Failed to redirect to OpenCampus ID. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadProfile = async (userAddress) => {
    try {
      if (!userAddress) {
        throw new Error("No address provided");
      }

      // Check OCID auth state first
      const authState = await ocidAuth.getAuthState();
      if (authState.isAuthenticated) {
        setProfile({
          ocid: authState.OCId,
          ethAddress: authState.ethAddress,
          isActive: true,
        });
        setHasProfile(true);
        return true;
      }

      // Fallback to contract check
      const profileExists = await hasActiveProfile(userAddress);
      setHasProfile(profileExists);

      if (profileExists) {
        const profileData = await getProfile(userAddress);
        setProfile(profileData);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error loading profile:", err);
      toast({
        title: "Error",
        description: "Error loading profile. Please try again.",
        variant: "destructive",
      });
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    if (typeof window.ethereum === "undefined") {
      setError("Please install MetaMask to use this application");
      return;
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("networkChanged", handleNetworkChanged);

    // Check for OCID redirect response
    const checkOCIDRedirect = async () => {
      try {
        const authState = await ocidAuth.handleLoginRedirect();
        if (authState.isAuthenticated) {
          await loadProfile(authState.ethAddress);
        }
      } catch (err) {
        console.error("Error handling OCID redirect:", err);
      }
    };

    checkOCIDRedirect();
    checkConnection();

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
      window.ethereum.removeListener("networkChanged", handleNetworkChanged);
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
        await loadProfile(accounts[0]);
      }
    } catch (err) {
      console.error("Error checking connection:", err);
      setError(err.message);
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAddress(null);
      setProfile(null);
      setHasProfile(false);
      toast({
        title: "Wallet Disconnected",
        description: "Please connect your wallet to continue.",
        variant: "destructive",
      });
    } else {
      setAddress(accounts[0]);
      setIsConnected(true);
      await loadProfile(accounts[0]);
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
    window.location.reload();
  };

  const handleNetworkChanged = async (networkId) => {
    const requiredNetworkId = "656476"; // Open Campus Layer 3
    if (networkId !== requiredNetworkId) {
      toast({
        title: "Wrong Network",
        description: "Please connect to the Open Campus Layer 3 network",
        variant: "destructive",
      });
    }
  };

  const connect = async () => {
    try {
      const { signer } = await connectWallet();
      const address = await signer.getAddress();
      setAddress(address);
      setIsConnected(true);
      setError(null);
      await loadProfile(address);
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
    setProfile(null);
    setHasProfile(false);
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
        profile,
        hasProfile,
        loadProfile,
        redirectToOCID,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
