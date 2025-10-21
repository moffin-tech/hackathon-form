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
    | "number";
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
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  conditional?: {
    dependsOn: string;
    showWhen: string | string[];
  };
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  sections: FormSection[];
  settings: {
    allowMultiSession: boolean;
    allowEdit: boolean;
    autoSave: boolean;
    showProgress: boolean;
    requireAuth: boolean;
  };
  permissions: {
    canView: string[];
    canEdit: string[];
    canSubmit: string[];
  };
}

export interface FormSubmission {
  id: string;
  formId: string;
  sessionId: string;
  userId?: string;
  data: Record<string, any>;
  status: "draft" | "submitted" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
}

export interface UserSession {
  id: string;
  userId?: string;
  organizationId?: string;
  formId: string;
  progress: number;
  currentSection: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookEvent {
  id: string;
  formId: string;
  sessionId: string;
  eventType:
    | "form_started"
    | "section_completed"
    | "form_submitted"
    | "form_edited";
  data: Record<string, any>;
  timestamp: Date;
}

