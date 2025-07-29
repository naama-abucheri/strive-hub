import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertHabitSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Habit } from "@shared/schema";

type HabitFormData = z.infer<typeof insertHabitSchema>;

interface HabitFormProps {
  habit?: Habit | null;
  onSuccess: () => void;
}

export default function HabitForm({ habit, onSuccess }: HabitFormProps) {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HabitFormData>({
    resolver: zodResolver(insertHabitSchema),
    defaultValues: {
      name: habit?.name || "",
      description: habit?.description || "",
      category: habit?.category || "general",
      isActive: habit?.isActive ?? true,
    },
  });

  const createHabitMutation = useMutation({
    mutationFn: async (data: HabitFormData) => {
      if (habit) {
        return await apiRequest("PATCH", `/api/habits/${habit.id}`, data);
      } else {
        return await apiRequest("POST", "/api/habits", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/categories"] });
      toast({
        title: "Success",
        description: habit ? "Habit updated successfully" : "Habit created successfully",
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
        description: habit ? "Failed to update habit" : "Failed to create habit",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: HabitFormData) => {
    createHabitMutation.mutate(data);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-slate-800">
          {habit ? "Edit Habit" : "Create New Habit"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-slate-700">Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter habit name"
            className="mt-1"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium text-slate-700">Description</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Describe your habit (optional)"
            rows={3}
            className="mt-1"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category" className="text-sm font-medium text-slate-700">Category</Label>
          <Select 
            value={watch("category")} 
            onValueChange={(value) => setValue("category", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="health">Health & Fitness</SelectItem>
              <SelectItem value="learning">Learning</SelectItem>
              <SelectItem value="productivity">Productivity</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={watch("isActive")}
            onCheckedChange={(checked) => setValue("isActive", checked)}
          />
          <Label htmlFor="isActive" className="text-sm font-medium text-slate-700">Active</Label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createHabitMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 font-medium transition-colors duration-200"
          >
            {createHabitMutation.isPending 
              ? (habit ? "Updating..." : "Creating...") 
              : (habit ? "Update Habit" : "Create Habit")
            }
          </Button>
        </div>
      </form>
    </div>
  );
}
