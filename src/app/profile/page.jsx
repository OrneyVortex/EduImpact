"use client";

import { useWallet } from "@/lib/WalletContext";
import ProfileDisplay from "@/components/ProfileDisplay";
import CreateProfile from "@/components/CreateProfile";

export default function ProfilePage() {
  const { hasProfile, profile } = useWallet();

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        {hasProfile ? <ProfileDisplay profile={profile} /> : <CreateProfile />}
      </div>
    </div>
  );
}
