import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudent extends Document {
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  grade?: string | null;
  register_no?: string | null;
  place?: string | null;
  residence_type?: string | null;
  enrollment_date?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    date_of_birth: { type: String, default: null },
    grade: { type: String, default: null },
    register_no: { type: String, default: null },
    place: { type: String, default: null },
    residence_type: { type: String, default: null },
    enrollment_date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  {
    timestamps: true,
  }
);

export const StudentModel: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

export function serializeStudent(doc: any) {
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    first_name: doc.first_name || "",
    last_name: doc.last_name || "",
    email: doc.email || null,
    phone: doc.phone || null,
    date_of_birth: doc.date_of_birth || null,
    grade: doc.grade || null,
    register_no: doc.register_no || null,
    place: doc.place || null,
    residence_type: doc.residence_type || null,
    enrollment_date: doc.enrollment_date || (doc.createdAt ? new Date(doc.createdAt).toISOString().split("T")[0] : ""),
    created_at: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    updated_at: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
  };
}
