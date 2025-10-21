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
import ImpersonationBanner from "@/components/admin/ImpersonationBanner";
import { useImpersonation } from "@/hooks/useImpersonation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { fetchGetUser } from "@/redux/features/authenticationSlice";
import { RootState } from "@/redux/store";

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
        </div>
      </div>
    </div>
  );
}
