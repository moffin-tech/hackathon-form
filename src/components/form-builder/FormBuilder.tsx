"use client";

import React, { useState } from "react";
import { FormTemplate, FormSection, FormField } from "@/types/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FormBuilderProps {
  formData: Partial<FormTemplate>;
  onUpdate: (updates: Partial<FormTemplate>) => void;
}

export function FormBuilder({ formData, onUpdate }: FormBuilderProps) {
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<{
    sectionIndex: number;
    fieldIndex: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const addSection = () => {
    const newSection: FormSection = {
      id: `section_${Date.now()}`,
      title: "Nueva Sección",
      description: "",
      fields: [],
      order: (formData.sections?.length || 0) + 1,
    };

    onUpdate({
      sections: [...(formData.sections || []), newSection],
    });
  };

  const updateSection = (index: number, updates: Partial<FormSection>) => {
    const sections = [...(formData.sections || [])];
    sections[index] = { ...sections[index], ...updates };
    onUpdate({ sections });
  };

  const deleteSection = (index: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta sección?")) {
      const sections = (formData.sections || []).filter((_, i) => i !== index);
      onUpdate({ sections });
      setSelectedSection(null);
      setSelectedField(null);
    }
  };

  const addField = (sectionIndex: number) => {
    const sections = [...(formData.sections || [])];
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: "text",
      label: "Nuevo Campo",
      placeholder: "",
      required: false,
      order: sections[sectionIndex].fields.length + 1,
    };

    sections[sectionIndex].fields.push(newField);
    onUpdate({ sections });
  };

  const updateField = (
    sectionIndex: number,
    fieldIndex: number,
    updates: Partial<FormField>
  ) => {
    const sections = [...(formData.sections || [])];
    sections[sectionIndex].fields[fieldIndex] = {
      ...sections[sectionIndex].fields[fieldIndex],
      ...updates,
    };
    onUpdate({ sections });
  };

  const deleteField = (sectionIndex: number, fieldIndex: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este campo?")) {
      const sections = [...(formData.sections || [])];
      sections[sectionIndex].fields.splice(fieldIndex, 1);
      onUpdate({ sections });
      setSelectedField(null);
    }
  };

  const fieldTypes = [
    { value: "text", label: "Texto" },
    { value: "email", label: "Email" },
    { value: "tel", label: "Teléfono" },
    { value: "number", label: "Número" },
    { value: "date", label: "Fecha" },
    { value: "textarea", label: "Área de texto" },
    { value: "select", label: "Selección" },
    { value: "radio", label: "Radio" },
    { value: "checkbox", label: "Checkbox" },
    { value: "file", label: "Archivo" },
  ];

  const saveForm = async () => {
    if (!formData.title || !formData.description || !formData.sections || formData.sections.length === 0) {
      toast.error("Por favor completa el título, descripción y al menos una sección");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          sections: formData.sections,
          settings: formData.settings || {
            allowMultiSession: true,
            allowEdit: true,
            autoSave: true,
            showProgress: true,
            requireAuth: false,
          },
          isPublic: formData.isPublic || false,
          tags: formData.tags || [],
          permissions: formData.permissions || {},
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Formulario creado exitosamente");
        router.push(`/forms/${result.slug}`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al crear formulario");
      }
    } catch (error) {
      toast.error("Error al crear formulario");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sections */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Secciones del Formulario</CardTitle>
              <CardDescription>
                Organiza tu formulario en secciones
              </CardDescription>
            </div>
            <Button onClick={addSection}>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Agregar Sección
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!formData.sections || formData.sections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>
                No hay secciones. Haz clic en "Agregar Sección" para comenzar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.sections.map((section, sectionIndex) => (
                <div key={section.id} className="border rounded-lg">
                  {/* Section Header */}
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        {selectedSection === sectionIndex ? (
                          <div className="space-y-2">
                            <Input
                              value={section.title}
                              onChange={(e) =>
                                updateSection(sectionIndex, {
                                  title: e.target.value,
                                })
                              }
                              placeholder="Título de la sección"
                            />
                            <Input
                              value={section.description || ""}
                              onChange={(e) =>
                                updateSection(sectionIndex, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="Descripción (opcional)"
                            />
                          </div>
                        ) : (
                          <div>
                            <h3 className="font-medium">{section.title}</h3>
                            {section.description && (
                              <p className="text-sm text-gray-600">
                                {section.description}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedSection(
                              selectedSection === sectionIndex
                                ? null
                                : sectionIndex
                            )
                          }
                        >
                          {selectedSection === sectionIndex
                            ? "Guardar"
                            : "Editar"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addField(sectionIndex)}
                        >
                          + Campo
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteSection(sectionIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Section Fields */}
                  <div className="p-4">
                    {section.fields.length === 0 ? (
                      <p className="text-gray-500 text-sm">
                        No hay campos en esta sección.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {section.fields.map((field, fieldIndex) => (
                          <div
                            key={field.id}
                            className="border rounded p-3 bg-white"
                          >
                            {selectedField?.sectionIndex === sectionIndex &&
                            selectedField?.fieldIndex === fieldIndex ? (
                              // Edit Field
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-sm font-medium">
                                      Tipo de campo
                                    </label>
                                    <select
                                      value={field.type}
                                      onChange={(e) =>
                                        updateField(sectionIndex, fieldIndex, {
                                          type: e.target.value as any,
                                        })
                                      }
                                      className="w-full p-2 border rounded-md"
                                    >
                                      {fieldTypes.map((type) => (
                                        <option
                                          key={type.value}
                                          value={type.value}
                                        >
                                          {type.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={`required_${field.id}`}
                                      checked={field.required}
                                      onChange={(e) =>
                                        updateField(sectionIndex, fieldIndex, {
                                          required: e.target.checked,
                                        })
                                      }
                                      className="rounded"
                                    />
                                    <label
                                      htmlFor={`required_${field.id}`}
                                      className="text-sm"
                                    >
                                      Campo obligatorio
                                    </label>
                                  </div>
                                </div>
                                <Input
                                  value={field.label}
                                  onChange={(e) =>
                                    updateField(sectionIndex, fieldIndex, {
                                      label: e.target.value,
                                    })
                                  }
                                  placeholder="Etiqueta del campo"
                                />
                                <Input
                                  value={field.placeholder || ""}
                                  onChange={(e) =>
                                    updateField(sectionIndex, fieldIndex, {
                                      placeholder: e.target.value,
                                    })
                                  }
                                  placeholder="Placeholder (opcional)"
                                />
                                {(field.type === "select" ||
                                  field.type === "radio") && (
                                  <div>
                                    <label className="text-sm font-medium">
                                      Opciones (una por línea)
                                    </label>
                                    <textarea
                                      className="w-full p-2 border rounded-md"
                                      value={
                                        field.options
                                          ?.map(
                                            (opt) => `${opt.value}|${opt.label}`
                                          )
                                          .join("\n") || ""
                                      }
                                      onChange={(e) => {
                                        const options = e.target.value
                                          .split("\n")
                                          .filter(Boolean)
                                          .map((line) => {
                                            const [value, label] =
                                              line.split("|");
                                            return {
                                              value: value?.trim() || "",
                                              label:
                                                label?.trim() ||
                                                value?.trim() ||
                                                "",
                                            };
                                          });
                                        updateField(sectionIndex, fieldIndex, {
                                          options,
                                        });
                                      }}
                                      placeholder="valor|Etiqueta"
                                      rows={3}
                                    />
                                  </div>
                                )}
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedField(null)}
                                  >
                                    Guardar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      deleteField(sectionIndex, fieldIndex)
                                    }
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Eliminar
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              // Display Field
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">
                                      {field.label}
                                    </span>
                                    {field.required && (
                                      <span className="text-red-500">*</span>
                                    )}
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      {
                                        fieldTypes.find(
                                          (t) => t.value === field.type
                                        )?.label
                                      }
                                    </span>
                                  </div>
                                  {field.placeholder && (
                                    <p className="text-sm text-gray-600">
                                      {field.placeholder}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setSelectedField({
                                      sectionIndex,
                                      fieldIndex,
                                    })
                                  }
                                >
                                  Editar
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={saveForm} 
          disabled={isSaving}
          className="px-8"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Crear Formulario
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

