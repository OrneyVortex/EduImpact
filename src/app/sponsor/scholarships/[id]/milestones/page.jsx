"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createScholarship } from "@/lib/contracts";

export default function CreateMilestones() {
  console.log("CreateMilestones component mounted");
  const params = useParams();
  console.log("URL params:", params);

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState([
    { title: "", description: "", reward: "" },
  ]);

  useEffect(() => {
    console.log("CreateMilestones component initialized");
    console.log("Current URL:", window.location.href);
  }, []);

  const handleAddMilestone = () => {
    setMilestones([...milestones, { title: "", description: "", reward: "" }]);
  };

  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index][field] = value;
    setMilestones(updatedMilestones);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Creating scholarship with milestones:", milestones);

      // Validate milestone data
      const isValid = milestones.every(
        (m) => m.title && m.description && m.reward && !isNaN(m.reward)
      );

      if (!isValid) {
        throw new Error("Please fill in all milestone fields with valid data");
      }

      // Format milestone data for contract
      const milestoneTitles = milestones.map((m) => m.title);
      const milestoneDescriptions = milestones.map((m) => m.description);
      const milestoneRewards = milestones.map((m) => m.reward);

      // Call createScholarship function
      const tx = await createScholarship(
        {
          title: "Scholarship Title", // You might want to pass this from the previous page
          description: "Scholarship Description",
          category: "Category",
          duration: "4", // 4 weeks default
          requiredSkills: "skill1, skill2",
        },
        milestones
      );

      console.log("Transaction successful:", tx);
      toast({
        title: "Success",
        description: "Scholarship created successfully!",
      });

      // Redirect to dashboard
      window.location.href = "/sponsor/dashboard";
    } catch (error) {
      console.error("Error creating scholarship:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create scholarship. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Milestones</CardTitle>
          <CardDescription>
            Add milestones for your scholarship. Each milestone should have a
            title, description, and reward amount.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="text-sm font-medium">Milestone {index + 1}</div>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor={`title-${index}`}>Title</Label>
                    <Input
                      id={`title-${index}`}
                      value={milestone.title}
                      onChange={(e) =>
                        handleMilestoneChange(index, "title", e.target.value)
                      }
                      placeholder="Enter milestone title"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={milestone.description}
                      onChange={(e) =>
                        handleMilestoneChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Enter milestone description"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`reward-${index}`}>Reward (EDU)</Label>
                    <Input
                      id={`reward-${index}`}
                      type="number"
                      value={milestone.reward}
                      onChange={(e) =>
                        handleMilestoneChange(index, "reward", e.target.value)
                      }
                      placeholder="Enter reward amount"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddMilestone}
              >
                Add Another Milestone
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Scholarship"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
