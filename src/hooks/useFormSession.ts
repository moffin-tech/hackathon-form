import { useState, useEffect, useCallback } from "react";
import { FormConfig, FormSubmission, UserSession } from "@/types/form";
import {
  generateSessionId,
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
} from "@/lib/utils";

interface UseFormSessionProps {
  formConfig: FormConfig;
  userId?: string;
  organizationId?: string;
}

interface UseFormSessionReturn {
  session: UserSession | null;
  currentSection: number;
  progress: number;
  isDirty: boolean;
  saveProgress: (data: Record<string, any>, sectionId: string) => void;
  loadSession: (sessionId: string) => void;
  createNewSession: () => void;
  resetSession: () => void;
  submitForm: () => Promise<FormSubmission>;
  updateSection: (sectionIndex: number) => void;
  getFormData: () => Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
}

export function useFormSession({
  formConfig,
  userId,
  organizationId,
}: UseFormSessionProps): UseFormSessionReturn {
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    const savedSessionId = loadFromLocalStorage(
      `form_session_${formConfig.id}`
    );
    if (savedSessionId) {
      loadSession(savedSessionId);
    } else if (formConfig.settings.allowMultiSession) {
      createNewSession();
    }
  }, [formConfig.id]);

  const createNewSession = useCallback(() => {
    const newSession: UserSession = {
      id: generateSessionId(),
      userId,
      organizationId,
      formId: formConfig.id,
      progress: 0,
      currentSection: formConfig.sections[0]?.id || "",
      data: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSession(newSession);
    setCurrentSection(0);
    setIsDirty(false);

    // Save session ID to localStorage
    saveToLocalStorage(`form_session_${formConfig.id}`, newSession.id);

    // Save session data
    saveToLocalStorage(`session_${newSession.id}`, newSession);
  }, [formConfig.id, formConfig.sections, userId, organizationId]);

  const loadSession = useCallback(
    (sessionId: string) => {
      const savedSession = loadFromLocalStorage(`session_${sessionId}`);
      if (savedSession) {
        setSession(savedSession);
        const sectionIndex = formConfig.sections.findIndex(
          (section) => section.id === savedSession.currentSection
        );
        setCurrentSection(Math.max(0, sectionIndex));
        setIsDirty(false);
      }
    },
    [formConfig.sections]
  );

  const saveProgress = useCallback(
    (data: Record<string, any>, sectionId: string) => {
      if (!session) return;

      const updatedSession: UserSession = {
        ...session,
        data: { ...session.data, ...data },
        currentSection: sectionId,
        progress: calculateProgress(),
        updatedAt: new Date(),
      };

      setSession(updatedSession);
      setIsDirty(true);

      // Auto-save if enabled
      if (formConfig.settings.autoSave) {
        saveToLocalStorage(`session_${session.id}`, updatedSession);
        setIsDirty(false);
      }
    },
    [session, formConfig.settings.autoSave]
  );

  const calculateProgress = useCallback(() => {
    if (!session) return 0;

    const totalFields = formConfig.sections.reduce((total, section) => {
      return total + section.fields.length;
    }, 0);

    const completedFields = Object.keys(session.data).length;
    return Math.round((completedFields / totalFields) * 100);
  }, [session, formConfig.sections]);

  const progress = calculateProgress();

  const resetSession = useCallback(() => {
    if (session) {
      removeFromLocalStorage(`session_${session.id}`);
      removeFromLocalStorage(`form_session_${formConfig.id}`);
    }
    setSession(null);
    setCurrentSection(0);
    setIsDirty(false);
  }, [session, formConfig.id]);

  const submitForm = useCallback(async (): Promise<FormSubmission> => {
    if (!session) {
      throw new Error("No active session");
    }

    const submission: FormSubmission = {
      id: `submission_${Date.now()}`,
      formId: formConfig.id,
      sessionId: session.id,
      userId: session.userId,
      data: session.data,
      status: "submitted",
      createdAt: session.createdAt,
      updatedAt: new Date(),
      submittedAt: new Date(),
    };

    // Save submission
    saveToLocalStorage(`submission_${submission.id}`, submission);

    // Clean up session
    removeFromLocalStorage(`session_${session.id}`);
    removeFromLocalStorage(`form_session_${formConfig.id}`);

    setSession(null);
    setCurrentSection(0);
    setIsDirty(false);

    return submission;
  }, [session, formConfig.id]);

  const updateSection = useCallback(
    (sectionIndex: number) => {
      if (sectionIndex >= 0 && sectionIndex < formConfig.sections.length) {
        setCurrentSection(sectionIndex);
        if (session) {
          const updatedSession = {
            ...session,
            currentSection: formConfig.sections[sectionIndex].id,
            updatedAt: new Date(),
          };
          setSession(updatedSession);
          saveToLocalStorage(`session_${session.id}`, updatedSession);
        }
      }
    },
    [formConfig.sections, session]
  );

  const getFormData = useCallback(() => {
    return session?.data || {};
  }, [session]);

  const setFormData = useCallback(
    (data: Record<string, any>) => {
      if (session) {
        const updatedSession = {
          ...session,
          data,
          updatedAt: new Date(),
        };
        setSession(updatedSession);
        setIsDirty(true);
      }
    },
    [session]
  );

  return {
    session,
    currentSection,
    progress,
    isDirty,
    saveProgress,
    loadSession,
    createNewSession,
    resetSession,
    submitForm,
    updateSection,
    getFormData,
    setFormData,
  };
}

