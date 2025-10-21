"use client";

import React, { useState, useEffect } from "react";
import { DynamicForm } from "@/components/forms/DynamicForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  sampleForms,
  financialOnboardingForm,
  employeeOnboardingForm,
  supplierOnboardingForm,
} from "@/data/sample-forms";
import { initializeMoffinApi } from "@/services/moffin-api";
import { FormSubmission } from "@/types/form";

export default function HomePage() {
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [formProgress, setFormProgress] = useState(0);
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [isApiConfigured, setIsApiConfigured] = useState(false);

  // Initialize Moffin API
  useEffect(() => {
    // In a real application, these would come from environment variables
    const apiConfig = {
      baseUrl: "https://solutions-api.moffin.mx/api",
      clientId: process.env.NEXT_PUBLIC_MOFFIN_CLIENT_ID || "your_client_id",
      clientSecret:
        process.env.NEXT_PUBLIC_MOFFIN_CLIENT_SECRET || "your_client_secret",
    };

    try {
      initializeMoffinApi(apiConfig);
      setIsApiConfigured(true);
    } catch (error) {
      console.error("Error initializing Moffin API:", error);
    }
  }, []);

  const handleFormSubmit = (submission: FormSubmission) => {
    setSubmission(submission);
    setSelectedForm(null);
  };

  const handleFormProgress = (progress: number) => {
    setFormProgress(progress);
  };

  const resetForm = () => {
    setSelectedForm(null);
    setFormProgress(0);
    setSubmission(null);
  };

  if (submission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl text-green-800">
                ¡Formulario Enviado!
              </CardTitle>
              <CardDescription className="text-lg">
                ¡Gracias por completar tu registro! Nuestro equipo validará tu
                información y recibirás noticias en un máximo de 24 horas
                hábiles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Detalles del envío:</h3>
                <p className="text-sm text-gray-600">
                  ID de envío: {submission.id}
                </p>
                <p className="text-sm text-gray-600">
                  Fecha: {new Date(submission.submittedAt!).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Estado: {submission.status}
                </p>
              </div>
              <Button onClick={resetForm} className="w-full">
                Completar otro formulario
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={resetForm} className="mb-4">
              ← Volver a formularios
            </Button>
            {formProgress > 0 && (
              <div className="text-sm text-gray-600">
                Progreso: {formProgress}% completado
              </div>
            )}
          </div>
          <DynamicForm
            formConfig={selectedForm}
            onSubmit={handleFormSubmit}
            onProgressChange={handleFormProgress}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Moffin Custom Forms
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Formularios dinámicos e inteligentes para tu empresa
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm mb-6">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isApiConfigured ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span>
                API Moffin {isApiConfigured ? "Conectada" : "No conectada"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Multi-sesión</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Autocompletado</span>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => window.open("/admin/dashboard", "_blank")}
              className="bg-purple-600 hover:bg-purple-700"
            >
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Panel de Administración
            </Button>
            <Button
              onClick={() => window.open("/admin/login", "_blank")}
              variant="outline"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
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
              <CardTitle>Formularios Dinámicos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Campos que aparecen condicionalmente según las respuestas del
                usuario
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <CardTitle>Multi-sesión</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Guarda el progreso automáticamente y continúa cuando quieras
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <CardTitle>Autocompletado Inteligente</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Integración con APIs de Moffin para validación automática
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Form Selection */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Selecciona un formulario para comenzar
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedForm(financialOnboardingForm)}
            >
              <CardHeader>
                <CardTitle>Onboarding Financiero</CardTitle>
                <CardDescription>
                  Registro de clientes con validación condicional para Persona
                  Física vs Persona Moral
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• Validación RFC/CURP automática</div>
                  <div>• Campos condicionales</div>
                  <div>• Carga de documentos</div>
                  <div>• Validaciones de riesgo</div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedForm(employeeOnboardingForm)}
            >
              <CardHeader>
                <CardTitle>Onboarding de Empleados</CardTitle>
                <CardDescription>
                  Proceso de incorporación con documentos específicos según tipo
                  de contrato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• Contratos a prueba vs indefinidos</div>
                  <div>• Documentos específicos</div>
                  <div>• Selección de beneficios</div>
                  <div>• Validación IMSS/CSF</div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedForm(supplierOnboardingForm)}
            >
              <CardHeader>
                <CardTitle>Onboarding de Proveedores</CardTitle>
                <CardDescription>
                  Registro de proveedores con validaciones de cumplimiento
                  fiscal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• Validación fiscal automática</div>
                  <div>• Servicios vs productos</div>
                  <div>• Documentos de cumplimiento</div>
                  <div>• Condiciones comerciales</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Demo Features */}
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold mb-4">
            Características implementadas
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="font-medium text-green-600">✓ Multi-sesión</div>
              <div className="text-gray-600">Guardado automático</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="font-medium text-green-600">
                ✓ Formularios dinámicos
              </div>
              <div className="text-gray-600">Campos condicionales</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="font-medium text-green-600">✓ Autocompletado</div>
              <div className="text-gray-600">API de Moffin</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="font-medium text-green-600">✓ Validaciones</div>
              <div className="text-gray-600">Email, teléfono, RFC</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="font-medium text-green-600">✓ Mobile-first</div>
              <div className="text-gray-600">Diseño responsive</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="font-medium text-green-600">
                ✓ Progreso visual
              </div>
              <div className="text-gray-600">Barra de progreso</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="font-medium text-green-600">✓ Editable</div>
              <div className="text-gray-600">Formularios modificables</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="font-medium text-green-600">✓ Omnicanal</div>
              <div className="text-gray-600">Web y móvil</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
