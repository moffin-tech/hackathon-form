"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { FormBuilder } from "@/components/form-builder/FormBuilder";

export default function NewFormPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<FormTemplate>>({
    title: "",
    description: "",
    sections: [],
    settings: {
      allowMultiSession: true,
      allowEdit: true,
      autoSave: true,
      showProgress: true,
      requireAuth: false,
    },
    permissions: {
      canView: ["*"],
      canEdit: ["*"],
      canSubmit: ["*"],
    },
    isPublic: false,
    tags: [],
  });
  const [isSaving, setIsSaving] = useState(false);

  // Authentication protection
  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      router.push("/admin/login");
      return;
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  const handleSave = async () => {
    if (
      !formData.title ||
      !formData.sections ||
      formData.sections.length === 0
    ) {
      toast.error("Por favor completa el título y al menos una sección");
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
          ...formData,
          createdBy: session?.user?.id,
        }),
      });

      if (response.ok) {
        const newForm = await response.json();
        toast.success("Formulario guardado exitosamente");
        router.push(`/admin/forms/${newForm._id}/edit`);
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al guardar formulario");
      }
    } catch (error) {
      toast.error("Error al guardar formulario");
    } finally {
      setIsSaving(false);
    }
  };

  const updateFormData = (updates: Partial<FormTemplate>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Crear Nuevo Formulario
            </h1>
            <p className="text-gray-600">
              Diseña tu formulario con nuestro constructor visual
            </p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Formulario"}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Settings */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Configuración del Formulario</CardTitle>
                <CardDescription>
                  Ajusta la configuración básica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={formData.title || ""}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder="Nombre del formulario"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    value={formData.description || ""}
                    onChange={(e) =>
                      updateFormData({ description: e.target.value })
                    }
                    placeholder="Descripción del formulario"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Etiquetas</label>
                  <Input
                    value={formData.tags?.join(", ") || ""}
                    onChange={(e) =>
                      updateFormData({
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="etiqueta1, etiqueta2, etiqueta3"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic || false}
                    onChange={(e) =>
                      updateFormData({ isPublic: e.target.checked })
                    }
                    className="rounded"
                  />
                  <label htmlFor="isPublic" className="text-sm">
                    Formulario público
                  </label>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Configuraciones</h4>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.settings?.allowMultiSession || false}
                        onChange={(e) =>
                          updateFormData({
                            settings: {
                              ...formData.settings,
                              allowMultiSession: e.target.checked,
                            },
                          })
                        }
                        className="rounded"
                      />
                      <span>Permitir multi-sesión</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.settings?.allowEdit || false}
                        onChange={(e) =>
                          updateFormData({
                            settings: {
                              ...formData.settings,
                              allowEdit: e.target.checked,
                            },
                          })
                        }
                        className="rounded"
                      />
                      <span>Permitir edición</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.settings?.autoSave || false}
                        onChange={(e) =>
                          updateFormData({
                            settings: {
                              ...formData.settings,
                              autoSave: e.target.checked,
                            },
                          })
                        }
                        className="rounded"
                      />
                      <span>Guardado automático</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.settings?.showProgress || false}
                        onChange={(e) =>
                          updateFormData({
                            settings: {
                              ...formData.settings,
                              showProgress: e.target.checked,
                            },
                          })
                        }
                        className="rounded"
                      />
                      <span>Mostrar progreso</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.settings?.requireAuth || false}
                        onChange={(e) =>
                          updateFormData({
                            settings: {
                              ...formData.settings,
                              requireAuth: e.target.checked,
                            },
                          })
                        }
                        className="rounded"
                      />
                      <span>Requerir autenticación</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Builder */}
          <div className="lg:col-span-2">
            <FormBuilder formData={formData} onUpdate={updateFormData} />
          </div>
        </div>
      </div>
    </div>
  );
}

