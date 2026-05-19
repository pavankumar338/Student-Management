"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateExamResultInput, ExamResult } from "@/types/performance";
import { Student } from "@/types/student";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const performanceSchema = z.object({
  student_id: z.string().min(1, "Please select a student"),
  exam_name: z.string().min(2, "Exam name is required"),
  subject: z.string().min(2, "Subject is required"),
  marks_obtained: z.number({ message: "Must be a valid number" }).min(0, "Marks cannot be negative"),
  total_marks: z.number({ message: "Must be a valid number" }).min(1, "Total marks must be at least 1"),
  exam_date: z.string().min(1, "Exam date is required"),
}).refine(data => data.marks_obtained <= data.total_marks, {
  message: "Marks obtained cannot exceed total marks",
  path: ["marks_obtained"],
});

type PerformanceFormValues = z.infer<typeof performanceSchema>;

interface PerformanceFormProps {
  initialData?: ExamResult;
  preselectedStudentId?: string;
}

export default function PerformanceForm({ initialData, preselectedStudentId }: PerformanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch students for the dropdown
    const fetchStudents = async () => {
      const { data } = await supabase.from("students").select("id, first_name, last_name, register_no").order("first_name");
      if (data) setStudents(data as Student[]);
    };
    fetchStudents();
  }, []);

  const form = useForm<PerformanceFormValues>({
    resolver: zodResolver(performanceSchema),
    defaultValues: {
      student_id: initialData?.student_id || preselectedStudentId || "",
      exam_name: initialData?.exam_name || "",
      subject: initialData?.subject || "",
      marks_obtained: initialData?.marks_obtained || 0,
      total_marks: initialData?.total_marks || 100,
      exam_date: initialData?.exam_date || format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = async (data: PerformanceFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (initialData) {
        const { error: updateError } = await supabase
          .from("exam_results")
          .update(data)
          .eq("id", initialData.id);
        
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("exam_results")
          .insert([data]);
        
        if (insertError) throw insertError;
      }
      
      // If we added from a student profile, go back there. Otherwise go to performance listing.
      if (preselectedStudentId) {
        router.push(`/students/${preselectedStudentId}`);
      } else {
        router.push("/performance");
      }
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
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Select Student</label>
          <select 
            {...form.register("student_id")} 
            disabled={!!preselectedStudentId && !initialData}
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-muted disabled:opacity-70"
          >
            <option value="">-- Choose a student --</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.first_name} {s.last_name} {s.register_no ? `(${s.register_no})` : ''}
              </option>
            ))}
          </select>
          {form.formState.errors.student_id && <p className="text-xs text-red-500">{form.formState.errors.student_id.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Exam Name</label>
          <select 
            {...form.register("exam_name")} 
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Select Exam</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Half-Yearly">Half-Yearly</option>
            <option value="Final Examinations">Final Examinations</option>
          </select>
          {form.formState.errors.exam_name && <p className="text-xs text-red-500">{form.formState.errors.exam_name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Subject</label>
          <input 
            {...form.register("subject")} 
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="e.g. Mathematics, Science"
          />
          {form.formState.errors.subject && <p className="text-xs text-red-500">{form.formState.errors.subject.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Marks Obtained</label>
          <input 
            type="number"
            {...form.register("marks_obtained", { valueAsNumber: true })} 
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {form.formState.errors.marks_obtained && <p className="text-xs text-red-500">{form.formState.errors.marks_obtained.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Total Marks</label>
          <input 
            type="number"
            {...form.register("total_marks", { valueAsNumber: true })} 
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {form.formState.errors.total_marks && <p className="text-xs text-red-500">{form.formState.errors.total_marks.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Exam Date</label>
          <input 
            {...form.register("exam_date")} 
            type="date"
            className="w-full px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 max-w-sm"
          />
          {form.formState.errors.exam_date && <p className="text-xs text-red-500">{form.formState.errors.exam_date.message}</p>}
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
          {initialData ? "Update Performance" : "Save Performance"}
        </button>
      </div>
    </form>
  );
}
