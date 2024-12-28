"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

const milestoneSchema = z.object({
  milestones: z.array(
    z.object({
      title: z.string().min(5, {
        message: "Title must be at least 5 characters.",
      }),
      description: z.string().min(20, {
        message: "Description must be at least 20 characters.",
      }),
      reward: z.string().refine((val) => !isNaN(val) && parseInt(val) > 0, {
        message: "Reward must be a positive number.",
      }),
      deadline: z.string().min(1, {
        message: "Deadline is required.",
      }),
      proofRequirements: z.string().min(10, {
        message: "Proof requirements must be at least 10 characters.",
      }),
    })
  ),
});

export default function MilestoneForm({
  onSubmit,
  isLoading = false,
  initialData = [],
}) {
  const form = useForm({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      milestones:
        initialData.length > 0
          ? initialData
          : [
              {
                title: "",
                description: "",
                reward: "",
                deadline: "",
                proofRequirements: "",
              },
            ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "milestones",
  });

  const handleSubmit = (values) => {
    onSubmit(values.milestones);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Milestone {index + 1}</h3>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name={`milestones.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Deploy Cloud Infrastructure"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear title for this milestone.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`milestones.${index}.reward`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reward (EDU)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="100"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        EDU tokens awarded for completing this milestone.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`milestones.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what needs to be accomplished in this milestone..."
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Detailed description of the milestone requirements.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`milestones.${index}.deadline`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>
                        Target date for milestone completion.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`milestones.${index}.proofRequirements`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proof Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List the required evidence to verify completion..."
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        What scholars need to submit as proof of completion.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                title: "",
                description: "",
                reward: "",
                deadline: "",
                proofRequirements: "",
              })
            }
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Scholarship..." : "Save Milestones"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
