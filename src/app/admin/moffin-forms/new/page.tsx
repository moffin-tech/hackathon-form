"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { fetchGetUser } from "@/redux/features/authenticationSlice";
import { RootState } from "@/redux/store";

export default function NewMoffinFormPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    user,
    organization,
    isLoading: authLoading,
    error: authError,
  } = useAppSelector((store: RootState) => store.authentication);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    accountType: "PF" as "PF" | "PM",
    serviceQueries: {
      bureauPM: false,
      bureauPF: false,
      prospectorPF: false,
      satBlackList: false,
      satRFC: false,
      renapoCurp: false,
      imssJobHistory: false,
      jumioIdValidation: false,
      caBlacklist: false,
    },
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug || !organization) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/moffin-forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          organizationId: organization.id,
        }),
      });

      if (response.ok) {
        toast.success("Formulario de Moffin creado exitosamente");
        router.push("/admin/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al crear formulario");
      }
    } catch (error) {
      toast.error("Error al crear formulario");
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceQueryChange = (key: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      serviceQueries: {
        ...prev.serviceQueries,
        [key]: value,
      },
    }));
  };

  if (authLoading) {
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Crear Formulario de Moffin
            </h1>
            <p className="text-gray-600 mt-2">
              Configura un nuevo formulario para la API de Moffin
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configuración del Formulario</CardTitle>
              <CardDescription>
                Completa la información básica del formulario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Organization Info */}
                {organization && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Organización
                    </label>
                    <div className="mt-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-md font-medium">
                      {organization.name}
                    </div>
                  </div>
                )}

                {/* Form Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Nombre del Formulario *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Ej: Formulario de Onboarding"
                    required
                  />
                </div>

                {/* Form Slug */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Slug *
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="Ej: onboarding-form"
                    required
                  />
                </div>

                {/* Account Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Tipo de Cuenta *
                  </label>
                  <select
                    value={formData.accountType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        accountType: e.target.value as "PF" | "PM",
                      }))
                    }
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="PF">Persona Física</option>
                    <option value="PM">Persona Moral</option>
                  </select>
                </div>

                {/* Service Queries */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Consultas de Servicio
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    {Object.entries(formData.serviceQueries).map(
                      ([key, value]) => (
                        <label
                          key={key}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              handleServiceQueryChange(key, e.target.checked)
                            }
                            className="rounded"
                          />
                          <span className="text-sm text-gray-700">
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creando..." : "Crear Formulario"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
