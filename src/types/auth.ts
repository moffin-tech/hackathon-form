import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      impersonatedUserId?: string;
      isImpersonating?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    impersonatedUserId?: string;
    isImpersonating?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    impersonatedUserId?: string;
    isImpersonating?: boolean;
  }
}

export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  role: "admin" | "user" | "customer_success";
  createdAt: Date;
  updatedAt: Date;
}

export interface FormTemplate {
  _id: string;
  title: string;
  description: string;
  sections: FormSection[];
  settings: FormSettings;
  permissions: FormPermissions;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  order: number;
  conditional?: {
    dependsOn: string;
    showWhen: string | string[];
  };
}

export interface FormField {
  id: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "select"
    | "multiselect"
    | "file"
    | "checkbox"
    | "radio"
    | "date"
    | "number"
    | "textarea";
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  options?: Array<{ value: string; label: string }>;
  conditional?: {
    dependsOn: string;
    showWhen: string | string[];
  };
  autocomplete?: {
    enabled: boolean;
    apiEndpoint?: string;
    fieldMapping?: Record<string, string>;
  };
  order: number;
}

export interface FormSettings {
  allowMultiSession?: boolean;
  allowEdit?: boolean;
  autoSave?: boolean;
  showProgress?: boolean;
  requireAuth?: boolean;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

export interface FormPermissions {
  canView: string[];
  canEdit: string[];
  canSubmit: string[];
}

export interface FormSubmission {
  _id: string;
  formId: string;
  sessionId: string;
  userId?: string;
  data: Record<string, any>;
  status: "draft" | "submitted" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
}
