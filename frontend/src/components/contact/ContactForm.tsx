import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/hooks";
import { Loader2 } from "lucide-react";
import api from "@/api/axiosInstance";
import type { AxiosError } from "axios";

const contactFormSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),
  category: z.enum([
    "bug",
    "feature_request",
    "technical_issue",
    "account",
    "other",
  ]),
  description: z
    .string()
    .min(20, "Please provide more details (at least 20 characters)")
    .max(2000, "Description must be less than 2000 characters"),
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subject: "",
      category: "other",
      description: "",
      email: user?.email || "",
      name: user?.fullName || "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      const categoryMap: Record<string, string> = {
        bug: "Bug",
        feature_request: "Feature Request",
        technical_issue: "Technical Issue",
        account: "Account Issue",
        other: "Other",
      };

      // 🔥 Map FE → BE values
      const payload = {
        subject: values.subject,
        category: categoryMap[values.category], // FIXED
        description: values.description,
        priority: "high", // you may add dynamic priority later
      };

      await api.post("/tickets", payload, { withCredentials: true });

      toast({
        title: "Ticket Submitted 🎉",
        description: "We received your issue and will reply soon.",
      });

      form.reset();
      onSuccess?.();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;

      toast({
        title: "Submission Failed",
        description:
          axiosError.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bug">🐛 Bug Report</SelectItem>
                  <SelectItem value="feature_request">
                    ✨ Feature Request
                  </SelectItem>
                  <SelectItem value="technical_issue">
                    ⚙️ Technical Issue
                  </SelectItem>
                  <SelectItem value="account">👤 Account Issue</SelectItem>
                  <SelectItem value="other">💬 Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subject */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input {...field} className="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[150px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Submit Ticket"
          )}
        </Button>
      </form>
    </Form>
  );
}
