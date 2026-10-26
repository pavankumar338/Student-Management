"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { AttendanceModel, serializeAttendance } from "@/lib/models/Attendance";
import "@/lib/models/Student"; // Register Student model for population
import { AttendanceRecord } from "@/types/attendance";
import { revalidatePath } from "next/cache";

export async function getAttendanceForDate(date: string): Promise<AttendanceRecord[]> {
  try {
    await connectToDatabase();
    const records = await AttendanceModel.find({ date })
      .populate("student_id", "first_name last_name register_no grade")
      .lean();

    return records.map(serializeAttendance) as AttendanceRecord[];
  } catch (error) {
    console.error(`Error fetching attendance for date ${date}:`, error);
    return [];
  }
}

export async function getAllAttendance(): Promise<AttendanceRecord[]> {
  try {
    await connectToDatabase();
    const records = await AttendanceModel.find()
      .populate("student_id", "first_name last_name register_no grade")
      .sort({ date: -1 })
      .lean();

    return records.map(serializeAttendance) as AttendanceRecord[];
  } catch (error) {
    console.error("Error fetching all attendance records:", error);
    return [];
  }
}

export async function setAttendance(
  studentId: string,
  date: string,
  status: "Present" | "Absent" | "Late"
) {
  try {
    await connectToDatabase();

    const existingRecord = await AttendanceModel.findOne({
      student_id: studentId,
      date,
    });

    if (existingRecord) {
      if (existingRecord.status === status) {
        // Toggle off if already selected
        await AttendanceModel.findByIdAndDelete(existingRecord._id);
        revalidatePath("/attendance");
        revalidatePath("/dashboard");
        revalidatePath("/analytics");
        return { success: true, action: "deleted", id: existingRecord._id.toString() };
      } else {
        // Update to new status
        existingRecord.status = status;
        await existingRecord.save();
        revalidatePath("/attendance");
        revalidatePath("/dashboard");
        revalidatePath("/analytics");
        return { success: true, action: "updated", data: serializeAttendance(existingRecord) };
      }
    } else {
      // Create new record
      const newRecord = await AttendanceModel.create({
        student_id: studentId,
        date,
        status,
      });

      revalidatePath("/attendance");
      revalidatePath("/dashboard");
      revalidatePath("/analytics");
      return { success: true, action: "created", data: serializeAttendance(newRecord) };
    }
  } catch (error: any) {
    console.error("Error marking attendance:", error);
    return { success: false, error: error.message || "Failed to mark attendance" };
  }
}
