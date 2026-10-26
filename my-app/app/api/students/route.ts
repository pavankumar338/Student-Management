import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { StudentModel, serializeStudent } from "@/lib/models/Student";

export async function GET() {
  try {
    await connectToDatabase();
    const students = await StudentModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(students.map(serializeStudent));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const student = await StudentModel.create(body);
    return NextResponse.json(serializeStudent(student), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create student" }, { status: 400 });
  }
}
