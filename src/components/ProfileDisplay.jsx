"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Trophy, Award, Star, Coins } from "lucide-react";

export default function ProfileDisplay({ profile }) {
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{profile.ocid}</span>
            <Badge variant={profile.isActive ? "default" : "secondary"}>
              {profile.isActive ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Reputation</p>
                <p className="text-sm text-muted-foreground">
                  {profile.reputation} points
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">EDU Balance</p>
                <p className="text-sm text-muted-foreground">
                  {profile.eduBalance} EDU
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">OC Points</p>
                <p className="text-sm text-muted-foreground">
                  {profile.ocPoints} points
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Verified Skills
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile.skills.length} skills
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
