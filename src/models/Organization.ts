import mongoose, { Document, Schema } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  slug: string;
  moffinApiKey: string;
  moffinBaseUrl: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    moffinApiKey: {
      type: String,
      required: true,
    },
    moffinBaseUrl: {
      type: String,
      required: true,
      default: "https://staging.moffin.mx/api/v1",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Organization ||
  mongoose.model<IOrganization>("Organization", OrganizationSchema);

