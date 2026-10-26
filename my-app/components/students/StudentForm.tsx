"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateStudentInput, Student } from "@/types/student";
import { createStudent, updateStudent } from "@/app/actions/students";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const studentSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address").or(z.literal("")).optional().nullable(),
  phone: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  grade: z.string().optional().nullable(),
  register_no: z.string().optional().nullable(),
  place: z.string().optional().nullable(),
  residence_type: z.string().optional().nullable(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  initialData?: Student;
}

export default function StudentForm({ initialData }: StudentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      date_of_birth: initialData?.date_of_birth || "",
      grade: initialData?.grade || "",
      register_no: initialData?.register_no || "",
      place: initialData?.place || "",
      residence_type: initialData?.residence_type || "",
    },
  });

  const onSubmit = async (data: StudentFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...data,
        email: data.email === "" ? null : data.email,
      };

      if (initialData) {
        const res = await updateStudent(initialData.id, payload);
        if (!res.success) throw new Error(res.error || "Failed to update student");
      } else {
        const res = await createStudent(payload);
        if (!res.success) throw new Error(res.error || "Failed to create student");
      }
      
      router.push("/students");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Name</label>
          <input 
            {...form.register("first_name")} 
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="John"
          />
          {form.formState.errors.first_name && <p className="text-xs text-red-500">{form.formState.errors.first_name.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Last Name</label>
          <input 
            {...form.register("last_name")} 
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Doe"
          />
          {form.formState.errors.last_name && <p className="text-xs text-red-500">{form.formState.errors.last_name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input 
            {...form.register("email")} 
            type="email"
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="john.doe@example.com"
          />
          {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <input 
            {...form.register("phone")} 
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date of Birth</label>
          <input 
            {...form.register("date_of_birth")} 
            type="date"
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Grade / Class</label>
          <select 
            {...form.register("grade")} 
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Select Grade</option>
            <option value="9th Grade">9th Grade</option>
            <option value="10th Grade">10th Grade</option>
            <option value="11th Grade">11th Grade</option>
            <option value="12th Grade">12th Grade</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Register Number</label>
          <input 
            {...form.register("register_no")} 
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="REG-12345"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Place</label>
          <input 
            {...form.register("place")} 
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="City or Town"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Residence Type</label>
          <select 
            {...form.register("residence_type")} 
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Select Type</option>
            <option value="Hosteller">Hosteller</option>
            <option value="Day Scholar">Day Scholar</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-4 gap-4">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-70 flex items-center gap-2"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {initialData ? "Update Student" : "Add Student"}
        </button>
      </div>
    </form>
  );
}
