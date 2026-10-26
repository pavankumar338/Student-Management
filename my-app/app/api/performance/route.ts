import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ExamResultModel, serializeExamResult } from "@/lib/models/ExamResult";
import "@/lib/models/Student";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("student_id");

    await connectToDatabase();
    const query = studentId ? { student_id: studentId } : {};
    const results = await ExamResultModel.find(query)
      .populate("student_id", "first_name last_name register_no grade")
      .sort({ exam_date: -1 })
      .lean();

    return NextResponse.json(results.map(serializeExamResult));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch exam results" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const created = await ExamResultModel.create(body);
    return NextResponse.json(serializeExamResult(created), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create exam result" }, { status: 400 });
  }
}
