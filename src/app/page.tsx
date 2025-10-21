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
  const {
    user,
    isLoading: authLoading,
    error: authError,
  } = useAppSelector((store: any) => store.authentication);
  const { getEffectiveUserId } = useImpersonation();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
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
    isPublic: false,
    tags: [],
  });

  const handleFormUpdate = (updates: any) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

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
            <FormBuilder formData={formData} onUpdate={handleFormUpdate} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
