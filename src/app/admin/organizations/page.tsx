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

export default function OrganizationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    moffinApiKey: "",
    moffinBaseUrl: "https://staging.moffin.mx/api/v1",
  });

  useEffect(() => {
    if (session) {
      fetchOrganizations();
    }
  }, [session]);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations");
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data);
      }
    } catch (error) {
      toast.error("Error al cargar organizaciones");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug || !formData.moffinApiKey) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Organización creada exitosamente");
        setShowForm(false);
        setFormData({
          name: "",
          slug: "",
          moffinApiKey: "",
          moffinBaseUrl: "https://staging.moffin.mx/api/v1",
        });
        fetchOrganizations();
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al crear organización");
      }
    } catch (error) {
      toast.error("Error al crear organización");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestionar Organizaciones
            </h1>
            <p className="text-gray-600">
              Administra las organizaciones y sus configuraciones de API
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
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
            Nueva Organización
          </Button>
        </div>

        {/* Organizations List */}
        <div className="grid gap-6">
          {organizations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No hay organizaciones
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza creando tu primera organización.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setShowForm(true)}>
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
                    Nueva Organización
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            organizations.map((org) => (
              <Card key={org._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{org.name}</CardTitle>
                      <CardDescription>
                        Slug: {org.slug} | Base URL: {org.moffinBaseUrl}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    <p>API Key: {org.moffinApiKey.substring(0, 8)}...</p>
                    <p>
                      Creado: {new Date(org.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Create Organization Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Nueva Organización</CardTitle>
                <CardDescription>
                  Configura una nueva organización con sus credenciales de API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Nombre *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Nombre de la organización"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Slug *
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          slug: e.target.value,
                        }))
                      }
                      placeholder="slug-organizacion"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      API Key de Moffin *
                    </label>
                    <Input
                      type="password"
                      value={formData.moffinApiKey}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          moffinApiKey: e.target.value,
                        }))
                      }
                      placeholder="Tu API key de Moffin"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Base URL de Moffin
                    </label>
                    <Input
                      value={formData.moffinBaseUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          moffinBaseUrl: e.target.value,
                        }))
                      }
                      placeholder="https://staging.moffin.mx/api/v1"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Crear Organización</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

