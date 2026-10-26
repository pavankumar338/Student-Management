import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AttendanceModel, serializeAttendance } from "@/lib/models/Attendance";
import "@/lib/models/Student";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    await connectToDatabase();
    const query = date ? { date } : {};
    const records = await AttendanceModel.find(query)
      .populate("student_id", "first_name last_name register_no grade")
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(records.map(serializeAttendance));
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { student_id, date, status } = body;

    await connectToDatabase();
    const updated = await AttendanceModel.findOneAndUpdate(
      { student_id, date },
      { status },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(serializeAttendance(updated), { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save attendance" }, { status: 400 });
  }
}
