import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { insertHabitSchema, type Habit } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";
import { z } from "zod";

const habitFormSchema = insertHabitSchema.extend({
  category: z.string().min(1, "Category is required"),
});

type HabitFormData = z.infer<typeof habitFormSchema>;

interface HabitFormProps {
  habit?: Habit | null;
  onSuccess: () => void;
}

export default function HabitForm({ habit, onSuccess }: HabitFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<HabitFormData>({
    resolver: zodResolver(habitFormSchema),
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
        await apiRequest("PATCH", `/api/habits/${habit.id}`, data);
      } else {
        await apiRequest("POST", "/api/habits", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
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
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: HabitFormData) => {
    setIsSubmitting(true);
    createHabitMutation.mutate(data);
  };

  const categories = [
    { value: "health", label: "Health & Fitness" },
    { value: "learning", label: "Learning & Education" },
    { value: "productivity", label: "Productivity" },
    { value: "personal", label: "Personal Development" },
    { value: "general", label: "General" },
  ];

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>{habit ? "Edit Habit" : "Create New Habit"}</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Habit Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter habit name" {...field} />
                </FormControl>
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
                    placeholder="Describe your habit (optional)" 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Enable this habit for daily tracking
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Saving..." : habit ? "Update Habit" : "Create Habit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}