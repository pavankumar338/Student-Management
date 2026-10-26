"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { StudentModel, serializeStudent } from "@/lib/models/Student";
import { ExamResultModel } from "@/lib/models/ExamResult";
import { AttendanceModel } from "@/lib/models/Attendance";
import { Student } from "@/types/student";
import { revalidatePath } from "next/cache";

export async function getStudents(): Promise<Student[]> {
  try {
    await connectToDatabase();
    const students = await StudentModel.find().sort({ createdAt: -1 }).lean();
    return students.map(serializeStudent) as Student[];
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
  try {
    await connectToDatabase();
    const student = await StudentModel.findById(id).lean();
    if (!student) return null;
    return serializeStudent(student) as Student;
  } catch (error) {
    console.error(`Error fetching student with id ${id}:`, error);
    return null;
  }
}

export async function getStudentsDropdown(): Promise<Array<{ id: string; first_name: string; last_name: string; register_no: string | null }>> {
  try {
    await connectToDatabase();
    const students = await StudentModel.find({}, "first_name last_name register_no")
      .sort({ first_name: 1 })
      .lean();
    return students.map((s: any) => ({
      id: s._id.toString(),
      first_name: s.first_name,
      last_name: s.last_name,
      register_no: s.register_no || null,
    }));
  } catch (error) {
    console.error("Error fetching students dropdown:", error);
    return [];
  }
}

export async function createStudent(data: Partial<Student>) {
  try {
    await connectToDatabase();
    const newStudent = await StudentModel.create({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email || null,
      phone: data.phone || null,
      date_of_birth: data.date_of_birth || null,
      grade: data.grade || null,
      register_no: data.register_no || null,
      place: data.place || null,
      residence_type: data.residence_type || null,
      enrollment_date: data.enrollment_date || new Date().toISOString().split("T")[0],
    });

    revalidatePath("/students");
    revalidatePath("/dashboard");
    revalidatePath("/attendance");
    revalidatePath("/analytics");

    return { success: true, data: serializeStudent(newStudent) };
  } catch (error: any) {
    console.error("Error creating student:", error);
    return { success: false, error: error.message || "Failed to create student" };
  }
}

export async function updateStudent(id: string, data: Partial<Student>) {
  try {
    await connectToDatabase();
    const updated = await StudentModel.findByIdAndUpdate(
      id,
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email || null,
        phone: data.phone || null,
        date_of_birth: data.date_of_birth || null,
        grade: data.grade || null,
        register_no: data.register_no || null,
        place: data.place || null,
        residence_type: data.residence_type || null,
      },
      { new: true }
    ).lean();

    if (!updated) {
      return { success: false, error: "Student not found" };
    }

    revalidatePath("/students");
    revalidatePath(`/students/${id}`);
    revalidatePath("/dashboard");
    revalidatePath("/attendance");
    revalidatePath("/analytics");

    return { success: true, data: serializeStudent(updated) };
  } catch (error: any) {
    console.error("Error updating student:", error);
    return { success: false, error: error.message || "Failed to update student" };
  }
}

export async function deleteStudent(id: string) {
  try {
    await connectToDatabase();
    
    // Delete student and cascade associated data
    await Promise.all([
      StudentModel.findByIdAndDelete(id),
      ExamResultModel.deleteMany({ student_id: id }),
      AttendanceModel.deleteMany({ student_id: id }),
    ]);

    revalidatePath("/students");
    revalidatePath("/dashboard");
    revalidatePath("/performance");
    revalidatePath("/attendance");
    revalidatePath("/analytics");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting student:", error);
    return { success: false, error: error.message || "Failed to delete student" };
  }
}
