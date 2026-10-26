import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAttendance extends Document {
  student_id: mongoose.Types.ObjectId;
  status: "Present" | "Absent" | "Late";
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema(
  {
    student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      required: true,
    },
    date: {
      type: String,
      required: true,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index for student_id and date
AttendanceSchema.index({ student_id: 1, date: 1 }, { unique: true });

export const AttendanceModel: Model<IAttendance> =
  mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", AttendanceSchema);

export function serializeAttendance(doc: any) {
  if (!doc) return null;

  let studentObj = undefined;
  if (doc.student_id && typeof doc.student_id === "object" && doc.student_id.first_name) {
    studentObj = {
      id: doc.student_id._id?.toString(),
      first_name: doc.student_id.first_name || "",
      last_name: doc.student_id.last_name || "",
      register_no: doc.student_id.register_no || null,
      grade: doc.student_id.grade || null,
    };
  }

  return {
    id: doc._id.toString(),
    student_id: (doc.student_id?._id || doc.student_id)?.toString(),
    status: doc.status,
    date: doc.date,
    created_at: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    students: studentObj,
  };
}
