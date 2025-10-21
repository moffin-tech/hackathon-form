"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export default function FormSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="container mx-auto p-6 max-w-md">
        <Card>
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
            <CardTitle className="text-2xl text-green-600">
              ¡Formulario Enviado!
            </CardTitle>
            <CardDescription>
              Tu formulario ha sido enviado exitosamente. Gracias por completarlo.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Hemos recibido tu información y la procesaremos a la brevedad.
            </p>
            <div className="flex flex-col space-y-2">
              <Button onClick={() => router.push("/")}>
                Volver al inicio
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/forms/${slug}`)}
              >
                Completar otro formulario
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
