"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Form Builder
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Crea formularios dinámicos e inteligentes de forma fácil y rápida
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => router.push("/admin/login")}
              size="lg"
              className="px-8 py-3"
            >
              Iniciar Sesión
            </Button>
            <Button
              onClick={() => router.push("/admin/register")}
              variant="outline"
              size="lg"
              className="px-8 py-3"
            >
              Registrarse
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
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
              </div>
              <CardTitle>Builder Visual</CardTitle>
              <CardDescription>
                Crea formularios arrastrando y soltando elementos sin necesidad
                de código
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
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
              </div>
              <CardTitle>Rápido y Eficiente</CardTitle>
              <CardDescription>
                Genera formularios en minutos con nuestra interfaz intuitiva
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <CardTitle>Validación Inteligente</CardTitle>
              <CardDescription>
                Validación automática de campos y reglas de negocio
                personalizables
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">¿Listo para empezar?</CardTitle>
              <CardDescription className="text-lg">
                Únete a miles de usuarios que ya están creando formularios
                increíbles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/admin/login")}
                size="lg"
                className="w-full"
              >
                Comenzar Ahora
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
