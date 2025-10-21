import React, { useState, useEffect } from "react";
import {
  FormConfig,
  FormSection,
  FormField as FormFieldType,
} from "@/types/form";
import { useFormSession } from "@/hooks/useFormSession";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface DynamicFormProps {
  formConfig: FormConfig;
  userId?: string;
  organizationId?: string;
  onSubmit?: (submission: any) => void;
  onProgressChange?: (progress: number) => void;
}

export function DynamicForm({
  formConfig,
  userId,
  organizationId,
  onSubmit,
  onProgressChange,
}: DynamicFormProps) {
  const {
    session,
    currentSection,
    progress,
    isDirty,
    saveProgress,
    createNewSession,
    resetSession,
    submitForm,
    updateSection,
    getFormData,
    setFormData,
  } = useFormSession({ formConfig, userId, organizationId });

  const [sectionData, setSectionData] = useState<Record<string, any>>({});
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current section
  const currentSectionData = formConfig.sections[currentSection];

  // Update progress callback
  useEffect(() => {
    onProgressChange?.(progress);
  }, [progress, onProgressChange]);

  // Check if section should be visible based on conditional logic
  const shouldShowSection = (section: FormSection): boolean => {
    if (!section.conditional) return true;

    const formData = getFormData();
    const dependsOnValue = formData[section.conditional.dependsOn];

    if (Array.isArray(section.conditional.showWhen)) {
      return section.conditional.showWhen.includes(dependsOnValue);
    }

    return dependsOnValue === section.conditional.showWhen;
  };

  // Check if field should be visible based on conditional logic
  const shouldShowField = (field: FormFieldType): boolean => {
    if (!field.conditional) return true;

    const formData = getFormData();
    const dependsOnValue = formData[field.conditional.dependsOn];

    if (Array.isArray(field.conditional.showWhen)) {
      return field.conditional.showWhen.includes(dependsOnValue);
    }

    return dependsOnValue === field.conditional.showWhen;
  };

  // Get visible sections
  const visibleSections = formConfig.sections.filter(shouldShowSection);

  // Update current section when visible sections change
  useEffect(() => {
    if (
      currentSection >= visibleSections.length &&
      visibleSections.length > 0
    ) {
      updateSection(visibleSections.length - 1);
    }
  }, [visibleSections.length, currentSection, updateSection]);

  // Load section data when section changes
  useEffect(() => {
    if (currentSectionData) {
      const formData = getFormData();
      const sectionFields = currentSectionData.fields.reduce((acc, field) => {
        if (shouldShowField(field)) {
          acc[field.id] = formData[field.id] || "";
        }
        return acc;
      }, {} as Record<string, any>);
      setSectionData(sectionFields);
    }
  }, [currentSectionData, getFormData]);

  // Handle field change
  const handleFieldChange = (fieldId: string, value: any) => {
    setSectionData((prev) => ({ ...prev, [fieldId]: value }));
    setSectionErrors((prev) => ({ ...prev, [fieldId]: "" }));
  };

  // Validate section
  const validateSection = (): boolean => {
    if (!currentSectionData) return false;

    const errors: Record<string, string> = {};
    let isValid = true;

    currentSectionData.fields.forEach((field) => {
      if (!shouldShowField(field)) return;

      const value = sectionData[field.id];

      if (field.required && (!value || value === "")) {
        errors[field.id] = "Este campo es obligatorio";
        isValid = false;
      }

      // Additional validations can be added here
    });

    setSectionErrors(errors);
    return isValid;
  };

  // Handle next section
  const handleNext = () => {
    if (!validateSection()) return;

    // Save current section data
    saveProgress(sectionData, currentSectionData.id);

    // Move to next section
    const nextSectionIndex = currentSection + 1;
    if (nextSectionIndex < visibleSections.length) {
      updateSection(nextSectionIndex);
    }
  };

  // Handle previous section
  const handlePrevious = () => {
    if (currentSection > 0) {
      updateSection(currentSection - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateSection()) return;

    setIsSubmitting(true);
    try {
      // Save final section data
      saveProgress(sectionData, currentSectionData.id);

      // Submit form
      const submission = await submitForm();
      onSubmit?.(submission);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle session creation
  const handleCreateSession = () => {
    createNewSession();
  };

  if (!session && formConfig.settings.allowMultiSession) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Nueva Sesión</CardTitle>
          <CardDescription>
            Crear una nueva sesión para completar el formulario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleCreateSession} className="w-full">
            Iniciar Formulario
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentSectionData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No hay secciones disponibles</p>
        </CardContent>
      </Card>
    );
  }

  const isLastSection = currentSection === visibleSections.length - 1;
  const isFirstSection = currentSection === 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      {formConfig.settings.showProgress && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso del formulario</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} showPercentage={false} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  Sección {currentSection + 1} de {visibleSections.length}
                </span>
                {isDirty && <span>Cambios sin guardar</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>{currentSectionData.title}</CardTitle>
          {currentSectionData.description && (
            <CardDescription>{currentSectionData.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {currentSectionData.fields.map((field) => {
            if (!shouldShowField(field)) return null;

            return (
              <FormField
                key={field.id}
                field={field}
                value={sectionData[field.id] || ""}
                onChange={(value) => handleFieldChange(field.id, value)}
                error={sectionErrors[field.id]}
              />
            );
          })}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <div>
              {!isFirstSection && (
                <Button variant="outline" onClick={handlePrevious}>
                  Anterior
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              {formConfig.settings.allowEdit && (
                <Button variant="outline" onClick={resetSession}>
                  Reiniciar
                </Button>
              )}

              {isLastSection ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </Button>
              ) : (
                <Button onClick={handleNext}>Siguiente</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Info */}
      {session && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>ID de Sesión: {session.id.slice(-8)}</span>
              <span>
                Última actualización:{" "}
                {new Date(session.updatedAt).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

