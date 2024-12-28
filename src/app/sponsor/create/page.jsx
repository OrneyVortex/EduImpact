"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import MilestoneForm from "../../../components/MilestoneForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  amount: z.string().refine((val) => !isNaN(val) && parseInt(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  requiredSkills: z.string().min(1, {
    message: "Required skills cannot be empty.",
  }),
  duration: z.string().refine((val) => !isNaN(val) && parseInt(val) > 0, {
    message: "Duration must be a positive number.",
  }),
  maxParticipants: z
    .string()
    .refine((val) => !isNaN(val) && parseInt(val) > 0, {
      message: "Max participants must be a positive number.",
    }),
});

export default function CreateScholarship() {
  const [activeTab, setActiveTab] = useState("details");
  const [scholarshipDetails, setScholarshipDetails] = useState(null);
  const [milestones, setMilestones] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      category: "",
      requiredSkills: "",
      duration: "",
      maxParticipants: "",
    },
  });

  function onSubmitDetails(values) {
    setScholarshipDetails(values);
    setActiveTab("milestones");
  }

  function onSubmitMilestones(milestoneData) {
    setMilestones(milestoneData);
    // TODO: Implement contract interaction with both scholarshipDetails and milestones
    console.log("Scholarship Details:", scholarshipDetails);
    console.log("Milestones:", milestoneData);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/sponsor/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Scholarship</h1>
          <p className="text-muted-foreground">
            Set up a new scholarship program for tech learners
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="details"
            disabled={activeTab === "milestones" && !scholarshipDetails}
          >
            <div className="flex items-center gap-2">
              {scholarshipDetails && <Check className="w-4 h-4" />}
              Scholarship Details
            </div>
          </TabsTrigger>
          <TabsTrigger value="milestones" disabled={!scholarshipDetails}>
            <div className="flex items-center gap-2">
              {milestones.length > 0 && <Check className="w-4 h-4" />}
              Define Milestones
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Scholarship Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitDetails)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Cloud Computing Mastery"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A clear and concise title for your scholarship
                          program.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the scholarship program, its goals, and expectations..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed information about the scholarship and what
                          scholars will learn.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Amount (EDU)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="500" {...field} />
                          </FormControl>
                          <FormDescription>
                            Total EDU tokens allocated for this scholarship.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cloud">
                                Cloud Computing
                              </SelectItem>
                              <SelectItem value="blockchain">
                                Blockchain
                              </SelectItem>
                              <SelectItem value="ai">
                                Artificial Intelligence
                              </SelectItem>
                              <SelectItem value="devops">DevOps</SelectItem>
                              <SelectItem value="security">
                                Cybersecurity
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The main focus area of the scholarship.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requiredSkills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Required Skills</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. JavaScript, Python, AWS basics"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Comma-separated list of prerequisite skills.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (weeks)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="12" {...field} />
                          </FormControl>
                          <FormDescription>
                            Expected time to complete all milestones.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Participants</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="10" {...field} />
                          </FormControl>
                          <FormDescription>
                            Maximum number of scholars that can enroll.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button variant="outline" type="button">
                      Save as Draft
                    </Button>
                    <Button type="submit">Continue to Milestones</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Define Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <MilestoneForm onSubmit={onSubmitMilestones} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
