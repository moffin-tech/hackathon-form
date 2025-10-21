"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchSigninAsOtherUser } from "@/redux/features/authenticationSlice";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailAsOtherUser, setEmailAsOtherUser] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector(
    (store) => store.authentication
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (emailAsOtherUser) {
        // Login with impersonation
        dispatch(
          fetchSigninAsOtherUser({
            email,
            password,
            emailAsOtherUser,
            onSuccess: () => {
              const redirectPath = searchParams.get("redirect") || "/";
              router.replace(redirectPath);
              router.refresh();
            },
          })
        );
      } else {
        // Regular login - you might want to implement this with Redux too
        toast.error("Por favor implementa el login regular con Redux");
      }
    } catch (error) {
      setError("Error al iniciar sesión");
      toast.error("Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>Accede a tu panel de administración</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Iniciar sesión como (opcional)
              </label>
              <Input
                type="email"
                value={emailAsOtherUser}
                onChange={(e) => setEmailAsOtherUser(e.target.value)}
                placeholder="cliente@email.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Solo para usuarios de Customer Success
              </p>
            </div>
            {(error || authError) && (
              <p className="text-red-500 text-sm">
                {error || "Correo electrónico o contraseña inválidos"}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿No puedes iniciar sesión?{" "}
              <Link
                href="/admin/login/resetpassword"
                className="text-blue-600 hover:underline"
              >
                Recuperar contraseña
              </Link>
            </p>
          </div>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-600 hover:underline">
              ← Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
