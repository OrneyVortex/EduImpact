"use client";

import { useState } from "react";
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

export default function CreateScholarship() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [scholarshipData, setScholarshipData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    requiredSkills: "",
    difficultyLevel: "",
  });

  const [milestones, setMilestones] = useState([
    { title: "", description: "", reward: "" },
  ]);

  const handleScholarshipChange = (field, value) => {
    setScholarshipData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
      console.log("Creating scholarship with data:", {
        scholarshipData,
        milestones,
      });

      // Validate all fields
      if (
        !scholarshipData.title ||
        !scholarshipData.description ||
        !scholarshipData.category ||
        !scholarshipData.duration ||
        !scholarshipData.requiredSkills ||
        !scholarshipData.difficultyLevel
      ) {
        throw new Error("Please fill in all scholarship fields");
      }

      // Validate milestone data and convert rewards to numbers
      const formattedMilestones = milestones.map((m, index) => {
        if (!m.title || !m.description || !m.reward) {
          throw new Error(
            `Please fill in all fields for milestone ${index + 1}`
          );
        }

        const reward = Number(m.reward);
        if (isNaN(reward) || reward <= 0) {
          throw new Error(
            `Please enter a valid reward amount for milestone ${index + 1}`
          );
        }

        return {
          ...m,
          reward: reward.toString(), // Convert to string for BigInt handling
        };
      });

      // Calculate total reward
      const totalReward = formattedMilestones.reduce(
        (sum, m) => sum + Number(m.reward),
        0
      );
      console.log("Total reward:", totalReward);

      // Call createScholarship function with formatted data
      const tx = await createScholarship(scholarshipData, formattedMilestones);
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
          <CardTitle>Create Scholarship</CardTitle>
          <CardDescription>
            Create a new scholarship with milestones and rewards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Scholarship Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Scholarship Details</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={scholarshipData.title}
                    onChange={(e) =>
                      handleScholarshipChange("title", e.target.value)
                    }
                    placeholder="Enter scholarship title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={scholarshipData.description}
                    onChange={(e) =>
                      handleScholarshipChange("description", e.target.value)
                    }
                    placeholder="Enter scholarship description"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={scholarshipData.category}
                    onChange={(e) =>
                      handleScholarshipChange("category", e.target.value)
                    }
                    placeholder="Enter category"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (weeks)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={scholarshipData.duration}
                    onChange={(e) =>
                      handleScholarshipChange("duration", e.target.value)
                    }
                    placeholder="Enter duration in weeks"
                  />
                </div>
                <div>
                  <Label htmlFor="requiredSkills">Required Skills</Label>
                  <Input
                    id="requiredSkills"
                    value={scholarshipData.requiredSkills}
                    onChange={(e) =>
                      handleScholarshipChange("requiredSkills", e.target.value)
                    }
                    placeholder="Enter required skills (comma separated)"
                  />
                </div>
                <div>
                  <Label htmlFor="difficultyLevel">
                    Difficulty Level (1-5)
                  </Label>
                  <Input
                    id="difficultyLevel"
                    type="number"
                    min="1"
                    max="5"
                    value={scholarshipData.difficultyLevel}
                    onChange={(e) =>
                      handleScholarshipChange("difficultyLevel", e.target.value)
                    }
                    placeholder="Enter difficulty level"
                  />
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Milestones</h3>
              {milestones.map((milestone, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="text-sm font-medium">
                    Milestone {index + 1}
                  </div>
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
                      <Label htmlFor={`description-${index}`}>
                        Description
                      </Label>
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

              <Button
                type="button"
                variant="outline"
                onClick={handleAddMilestone}
              >
                Add Another Milestone
              </Button>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Scholarship"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
