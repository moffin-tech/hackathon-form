"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { fetchGetUser } from "@/redux/features/authenticationSlice";
import { FormBuilder } from "@/components/form-builder/FormBuilder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import ImpersonationBanner from "@/components/admin/ImpersonationBanner";
import { useImpersonation } from "@/hooks/useImpersonation";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isLoading: authLoading, error: authError } = useAppSelector(
    (store: any) => store.authentication
  );
  const { getEffectiveUserId } = useImpersonation();
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

  // Show loading while checking authentication
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

  // Redirect to login if not authenticated or if there's an error
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
              Builder de Formularios
            </h1>
            <p className="text-gray-600">Bienvenido, {user?.name}</p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => router.push("/admin/dashboard")}
              variant="outline"
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
              Dashboard
            </Button>
          </div>
        </div>

        {/* Form Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Formulario</CardTitle>
            <CardDescription>
              Diseña formularios dinámicos e inteligentes con nuestro builder
              visual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormBuilder />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
