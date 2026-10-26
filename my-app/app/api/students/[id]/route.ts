import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { StudentModel, serializeStudent } from "@/lib/models/Student";
import { ExamResultModel } from "@/lib/models/ExamResult";
import { AttendanceModel } from "@/lib/models/Attendance";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const student = await StudentModel.findById(id).lean();
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(serializeStudent(student));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch student" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectToDatabase();
    const updated = await StudentModel.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(serializeStudent(updated));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update student" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    await Promise.all([
      StudentModel.findByIdAndDelete(id),
      ExamResultModel.deleteMany({ student_id: id }),
      AttendanceModel.deleteMany({ student_id: id }),
    ]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete student" }, { status: 500 });
  }
}
