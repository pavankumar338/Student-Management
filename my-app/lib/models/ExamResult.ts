import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExamResult extends Document {
  student_id: mongoose.Types.ObjectId;
  exam_name: string;
  subject: string;
  marks_obtained: number;
  total_marks: number;
  exam_date: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExamResultSchema: Schema = new Schema(
  {
    student_id: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    exam_name: { type: String, required: true },
    subject: { type: String, required: true },
    marks_obtained: { type: Number, required: true },
    total_marks: { type: Number, required: true },
    exam_date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  {
    timestamps: true,
  }
);

export const ExamResultModel: Model<IExamResult> =
  mongoose.models.ExamResult || mongoose.model<IExamResult>("ExamResult", ExamResultSchema);

export function serializeExamResult(doc: any) {
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
    exam_name: doc.exam_name || "",
    subject: doc.subject || "",
    marks_obtained: Number(doc.marks_obtained) || 0,
    total_marks: Number(doc.total_marks) || 100,
    exam_date: doc.exam_date || "",
    created_at: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    students: studentObj,
  };
}
