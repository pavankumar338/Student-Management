"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { ExamResultModel, serializeExamResult } from "@/lib/models/ExamResult";
import "@/lib/models/Student"; // Register Student model for population
import { ExamResult } from "@/types/performance";
import { revalidatePath } from "next/cache";

export async function getExamResults(studentId?: string): Promise<ExamResult[]> {
  try {
    await connectToDatabase();
    const query = studentId ? { student_id: studentId } : {};
    const results = await ExamResultModel.find(query)
      .populate("student_id", "first_name last_name register_no grade")
      .sort({ exam_date: -1 })
      .lean();

    return results.map(serializeExamResult) as ExamResult[];
  } catch (error) {
    console.error("Error fetching exam results:", error);
    return [];
  }
}

export async function createExamResult(data: {
  student_id: string;
  exam_name: string;
  subject: string;
  marks_obtained: number;
  total_marks: number;
  exam_date: string;
}) {
  try {
    await connectToDatabase();
    const created = await ExamResultModel.create({
      student_id: data.student_id,
      exam_name: data.exam_name,
      subject: data.subject,
      marks_obtained: data.marks_obtained,
      total_marks: data.total_marks,
      exam_date: data.exam_date,
    });

    revalidatePath("/performance");
    revalidatePath(`/students/${data.student_id}`);
    revalidatePath("/analytics");

    return { success: true, data: serializeExamResult(created) };
  } catch (error: any) {
    console.error("Error creating exam result:", error);
    return { success: false, error: error.message || "Failed to create exam result" };
  }
}

export async function updateExamResult(id: string, data: {
  student_id?: string;
  exam_name?: string;
  subject?: string;
  marks_obtained?: number;
  total_marks?: number;
  exam_date?: string;
}) {
  try {
    await connectToDatabase();
    const updated = await ExamResultModel.findByIdAndUpdate(id, data, { new: true }).lean();

    if (!updated) {
      return { success: false, error: "Exam result not found" };
    }

    revalidatePath("/performance");
    if (data.student_id) {
      revalidatePath(`/students/${data.student_id}`);
    }
    revalidatePath("/analytics");

    return { success: true, data: serializeExamResult(updated) };
  } catch (error: any) {
    console.error("Error updating exam result:", error);
    return { success: false, error: error.message || "Failed to update exam result" };
  }
}

export async function deleteExamResult(id: string) {
  try {
    await connectToDatabase();
    await ExamResultModel.findByIdAndDelete(id);

    revalidatePath("/performance");
    revalidatePath("/analytics");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting exam result:", error);
    return { success: false, error: error.message || "Failed to delete exam result" };
  }
}
