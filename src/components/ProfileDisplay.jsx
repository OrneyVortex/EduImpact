"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useWallet } from "../lib/WalletContext";
import { Icons } from "./icons";

export default function ProfileDisplay() {
  const { profile, redirectToOCID } = useWallet();

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-background border rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">No Profile Found</h2>
        <Button onClick={redirectToOCID}>
          <Icons.ocid className="mr-2 h-4 w-4" />
          Connect OpenCampus ID
        </Button>
      </div>
    );
  }

  // Ensure profile data has default values
  const displayName = profile.name || "Anonymous";
  const skills = profile.skills || [];
  const reputation = profile.reputation || 0;
  const completedCourses = profile.completedCourses || 0;
  const avatarUrl = profile.avatar || "";

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{displayName}</h2>
            <p className="text-sm text-muted-foreground">
              OCID: {profile.ocid || "Not Connected"}
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Reputation</h3>
            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="text-sm font-medium">{reputation} points</p>
                <p className="text-sm text-muted-foreground">
                  {skills.length} skills
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Progress</h3>
            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="text-sm font-medium">
                  {completedCourses} courses completed
                </p>
                <p className="text-sm text-muted-foreground">
                  Learning in progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
