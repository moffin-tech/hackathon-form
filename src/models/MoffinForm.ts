import mongoose, { Document, Schema } from "mongoose";

export interface IMoffinForm extends Document {
  name: string;
  slug: string;
  accountType: "PF" | "PM";
  serviceQueries: {
    bureauPM: boolean;
    bureauPF: boolean;
    prospectorPF: boolean;
    satBlackList: boolean;
    satRFC: boolean;
    renapoCurp: boolean;
    imssJobHistory: boolean;
    jumioIdValidation: boolean;
    caBlacklist: boolean;
  };
  moffinFormId: string; // ID returned by Moffin API
  organizationId: string;
  createdBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MoffinFormSchema = new Schema<IMoffinForm>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    accountType: {
      type: String,
      enum: ["PF", "PM"],
      required: true,
    },
    serviceQueries: {
      bureauPM: { type: Boolean, default: false },
      bureauPF: { type: Boolean, default: false },
      prospectorPF: { type: Boolean, default: false },
      satBlackList: { type: Boolean, default: false },
      satRFC: { type: Boolean, default: false },
      renapoCurp: { type: Boolean, default: false },
      imssJobHistory: { type: Boolean, default: false },
      jumioIdValidation: { type: Boolean, default: false },
      caBlacklist: { type: Boolean, default: false },
    },
    moffinFormId: {
      type: String,
      required: true,
    },
    organizationId: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.MoffinForm ||
  mongoose.model<IMoffinForm>("MoffinForm", MoffinFormSchema);

