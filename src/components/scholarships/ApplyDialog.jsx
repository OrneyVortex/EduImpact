"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import {
  CheckCircle,
  Clock,
  Coins,
  FileText,
  Trophy,
  Users,
} from "lucide-react";

export default function ApplyDialog({ scholarship, trigger }) {
  const milestones = [
    {
      id: 1,
      title: "Complete AWS Certified Cloud Practitioner",
      description: "Pass the certification exam and submit proof of completion",
      reward: "150",
    },
    {
      id: 2,
      title: "Build Cloud Infrastructure Project",
      description:
        "Deploy a scalable web application using AWS services and best practices",
      reward: "200",
    },
    {
      id: 3,
      title: "Contribute to Cloud-Native Project",
      description:
        "Make significant contributions to an open-source cloud-native project",
      reward: "150",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button>Apply Now</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            {scholarship.title}
            <Badge variant="secondary">{scholarship.category}</Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 pt-2">
            <Users className="w-4 h-4" />
            Sponsored by {scholarship.sponsor}
          </DialogDescription>
        </DialogHeader>

        {/* Scholarship Details */}
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">
              {scholarship.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Reward</p>
                <p className="text-lg font-bold">${scholarship.amount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Milestones</p>
                <p className="text-lg font-bold">3</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Deadline</p>
                <p className="text-lg font-bold">
                  {new Date(scholarship.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {scholarship.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-4">Milestones</h4>
            <Accordion type="single" collapsible className="w-full">
              {milestones.map((milestone) => (
                <AccordionItem
                  key={milestone.id}
                  value={`milestone-${milestone.id}`}
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>{milestone.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {milestone.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                          Reward: ${milestone.reward}
                        </span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Application Requirements
            </h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>Valid Open Campus ID with verified credentials</li>
              <li>Proof of technical background or relevant coursework</li>
              <li>Commitment to complete all milestones within deadline</li>
              <li>
                Agreement to share progress and contribute to the community
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" className="w-full sm:w-auto">
            Save for Later
          </Button>
          <Button className="w-full sm:w-auto">Submit Application</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
