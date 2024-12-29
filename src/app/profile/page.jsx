"use client";

import { useWallet } from "../../lib/WalletContext";
import ProfileDisplay from "../../components/ProfileDisplay";
import CreateProfile from "../../components/CreateProfile";
import { Card, CardContent } from "../../components/ui/card";

export default function ProfilePage() {
  const { hasProfile } = useWallet();

  return (
    <div className="container py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-4xl font-bold">Profile</h1>
          <p className="text-muted-foreground max-w-2xl">
            Manage your decentralized identity, track your achievements, and
            showcase your skills
          </p>
        </div>
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            {hasProfile ? <ProfileDisplay /> : <CreateProfile />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
