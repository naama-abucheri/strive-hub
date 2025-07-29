import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertGoalSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Goal } from "@shared/schema";

const goalFormSchema = insertGoalSchema.extend({
  deadline: z.string().min(1, "Deadline is required"),
});

type GoalFormData = z.infer<typeof goalFormSchema>;

interface GoalFormProps {
  goal?: Goal | null;
  onSuccess: () => void;
}

export default function GoalForm({ goal, onSuccess }: GoalFormProps) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: goal?.title || "",
      description: goal?.description || "",
      deadline: goal?.deadline || "",
      status: goal?.status || "active",
      progress: goal?.progress || 0,
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async (data: GoalFormData) => {
      if (goal) {
        return await apiRequest("PATCH", `/api/goals/${goal.id}`, data);
      } else {
        return await apiRequest("POST", "/api/goals", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "Success",
        description: goal ? "Goal updated successfully" : "Goal created successfully",
      });
      onSuccess();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: goal ? "Failed to update goal" : "Failed to create goal",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GoalFormData) => {
    createGoalMutation.mutate(data);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-slate-800">
          {goal ? "Edit Goal" : "Create New Goal"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-slate-700">Title</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Enter goal title"
            className="mt-1"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium text-slate-700">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Describe your goal (optional)"
            rows={3}
            className="mt-1"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="deadline" className="text-sm font-medium text-slate-700">Deadline</Label>
          <Input
            id="deadline"
            type="date"
            {...register("deadline")}
            className="mt-1"
          />
          {errors.deadline && (
            <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="status" className="text-sm font-medium text-slate-700">Status</Label>
          <Select 
            value={watch("status")} 
            onValueChange={(value) => setValue("status", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="progress" className="text-sm font-medium text-slate-700">Progress (%)</Label>
          <Input
            id="progress"
            type="number"
            min="0"
            max="100"
            {...register("progress", { valueAsNumber: true })}
            placeholder="0"
            className="mt-1"
          />
          {errors.progress && (
            <p className="text-red-500 text-sm mt-1">{errors.progress.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createGoalMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 font-medium transition-colors duration-200"
          >
            {createGoalMutation.isPending 
              ? (goal ? "Updating..." : "Creating...") 
              : (goal ? "Update Goal" : "Create Goal")
            }
          </Button>
        </div>
      </form>
    </div>
  );
}
