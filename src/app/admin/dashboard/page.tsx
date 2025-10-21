"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Link from "next/link";
import toast from "react-hot-toast";
import { FormTemplate } from "@/types/auth";
import ImpersonationBanner from "@/components/admin/ImpersonationBanner";
import { useImpersonation } from "@/hooks/useImpersonation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { fetchGetUser } from "@/redux/features/authenticationSlice";
import { RootState } from "@/redux/store";
import { financialOnboardingForm, employeeOnboardingForm, supplierOnboardingForm } from "@/data/sample-forms";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    user,
    organization,
    isLoading: authLoading,
    error: authError,
  } = useAppSelector((store: RootState) => store.authentication);
  const { getEffectiveUserId } = useImpersonation();
  const [forms, setForms] = useState<FormTemplate[]>([
    {
      _id: "1",
      title: "Onboarding Financiero",
      description: "Formulario para onboarding de clientes financieros",
      sections: financialOnboardingForm.sections,
      settings: financialOnboardingForm.settings,
      isPublic: true,
      tags: ["financiero", "onboarding"],
      permissions: {},
      createdBy: user?._id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "2", 
      title: "Onboarding de Empleados",
      description: "Formulario para onboarding de nuevos empleados",
      sections: employeeOnboardingForm.sections,
      settings: employeeOnboardingForm.settings,
      isPublic: true,
      tags: ["empleados", "onboarding"],
      permissions: {},
      createdBy: user?._id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "3",
      title: "Onboarding de Proveedores", 
      description: "Formulario para onboarding de proveedores",
      sections: supplierOnboardingForm.sections,
      settings: supplierOnboardingForm.settings,
      isPublic: true,
      tags: ["proveedores", "onboarding"],
      permissions: {},
      createdBy: user?._id || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Fetch user data if not already loaded
    if (!user && token) {
      dispatch(fetchGetUser());
    } else if (user) {
      setIsLoading(false);
    }
  }, [dispatch, router, user]);

  // Handle API errors - redirect to login
  useEffect(() => {
    if (authError && !authLoading) {
      // Clear any invalid tokens
      localStorage.removeItem("accessToken");
      router.push("/admin/login");
    }
  }, [authError, authLoading, router]);

  const deleteForm = async (formId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este formulario?")) {
      return;
    }

    try {
      // Remove from local state
      setForms(prevForms => prevForms.filter(form => form._id !== formId));
      toast.success("Formulario eliminado");
    } catch {
      toast.error("Error al eliminar formulario");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || authError) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Impersonation Banner */}
        <ImpersonationBanner />

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p className="text-gray-600">Bienvenido, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Organization Info */}
            {organization && (
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  Organización:
                </label>
                <span className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md font-medium">
                  {organization.name}
                </span>
              </div>
            )}
            <div className="flex space-x-4">
              <Link href="/admin/forms/new">
                <Button>
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
                  Nuevo Formulario
                </Button>
              </Link>
              <Link href="/admin/moffin-forms/new">
                <Button variant="outline">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Formulario Moffin
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Ver Formularios
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Formularios
                </CardTitle>
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{forms.length}</div>
                <p className="text-xs text-muted-foreground">
                  Formularios creados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Formularios Públicos
                </CardTitle>
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {forms.filter((f) => f.isPublic).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Disponibles públicamente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Último Formulario
                </CardTitle>
                <svg
                  className="h-4 w-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {forms.length > 0
                    ? new Date(forms[0].createdAt).toLocaleDateString()
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Fecha de creación
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Forms List */}
          <Card>
            <CardHeader>
              <CardTitle>Mis Formularios</CardTitle>
              <CardDescription>
                Gestiona tus formularios creados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {forms.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No hay formularios
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comienza creando tu primer formulario.
                  </p>
                  <div className="mt-6">
                    <Link href="/admin/forms/new">
                      <Button>
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
                        Nuevo Formulario
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {forms.map((form) => (
                    <div
                      key={form._id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium">{form.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {form.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{form.sections.length} secciones</span>
                            <span>{form.isPublic ? "Público" : "Privado"}</span>
                            <span>
                              Creado:{" "}
                              {new Date(form.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/admin/forms/${form._id}/edit`}>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </Link>
                          <Link href={`/form/${form._id}`}>
                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteForm(form._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
