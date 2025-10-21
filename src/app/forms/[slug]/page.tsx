"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FormTemplate, FormField } from "@/types/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import toast from "react-hot-toast";

export default function PublicFormPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [form, setForm] = useState<FormTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    if (!slug) return;
    
    // Generate or retrieve session ID
    const storedSessionId = localStorage.getItem(`form_session_${slug}`);
    if (storedSessionId) {
      setSessionId(storedSessionId);
      loadFormAndData(storedSessionId);
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      localStorage.setItem(`form_session_${slug}`, newSessionId);
      loadForm();
    }
  }, [slug]);

  const loadForm = async () => {
    try {
      const response = await fetch(`/api/forms/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setForm(data.form);
      } else {
        toast.error("Formulario no encontrado");
        router.push("/");
      }
    } catch (error) {
      toast.error("Error al cargar formulario");
    } finally {
      setIsLoading(false);
    }
  };

  const loadFormAndData = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/forms/${slug}/submission?sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setForm(data.form);
        if (data.submission) {
          setFormData(data.submission.data || {});
        }
      } else {
        loadForm();
      }
    } catch (error) {
      loadForm();
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (data: Record<string, any>, status: "draft" | "submitted" = "draft") => {
    if (!form || !sessionId) return;
    
    try {
      await fetch(`/api/forms/${slug}/submission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          data,
          status,
        }),
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    const newData = { ...formData, [fieldId]: value };
    setFormData(newData);
    
    // Auto-save if enabled
    if (form?.settings?.autoSave) {
      saveProgress(newData);
    }
  };

  const handleSubmit = async () => {
    if (!form) return;
    
    setIsSubmitting(true);
    try {
      await saveProgress(formData, "submitted");
      toast.success("Formulario enviado exitosamente");
      
      // Clear session
      localStorage.removeItem(`form_session_${slug}`);
      
      // Redirect or show success message
      router.push(`/forms/${slug}/success`);
    } catch (error) {
      toast.error("Error al enviar formulario");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || "";
    
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full"
          />
        );
      
      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        );
      
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecciona una opción</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  required={field.required}
                  className="text-blue-600"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={Array.isArray(value) ? value.includes(option.value) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    handleFieldChange(field.id, newValues);
                  }}
                  className="text-blue-600"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case "date":
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            className="w-full"
          />
        );
      
      case "file":
        return (
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFieldChange(field.id, file.name);
              }
            }}
            required={field.required}
            className="w-full"
          />
        );
      
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full"
          />
        );
    }
  };

  const calculateProgress = () => {
    if (!form || !form.sections) return 0;
    
    const totalFields = form.sections.reduce((acc, section) => acc + section.fields.length, 0);
    const completedFields = Object.keys(formData).length;
    
    return totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Formulario no encontrado</h1>
          <Button onClick={() => router.push("/")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
          <p className="text-gray-600">{form.description}</p>
          
          {form.settings?.showProgress && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progreso</span>
                <span>{Math.round(calculateProgress())}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
          )}
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          {form.sections?.map((section, sectionIndex) => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                {section.description && (
                  <CardDescription>{section.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(field)}
                    {field.placeholder && (
                      <p className="text-xs text-gray-500">{field.placeholder}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : (
              "Enviar Formulario"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
