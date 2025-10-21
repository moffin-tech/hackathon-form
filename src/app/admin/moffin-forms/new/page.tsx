"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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

export default function NewMoffinFormPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
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
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations");
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data);
        if (data.length > 0) {
          setSelectedOrganization(data[0]._id);
        }
      }
    } catch (error) {
      toast.error("Error al cargar organizaciones");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug || !selectedOrganization) {
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
          organizationId: selectedOrganization,
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
                {/* Organization Selector */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Organización *
                  </label>
                  <select
                    value={selectedOrganization}
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecciona una organización</option>
                    {organizations.map((org) => (
                      <option key={org._id} value={org._id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

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

