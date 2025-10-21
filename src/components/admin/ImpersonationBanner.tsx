"use client";

import { useImpersonation } from "@/hooks/useImpersonation";
import { Button } from "@/components/ui/Button";
import { X, User } from "lucide-react";

export default function ImpersonationBanner() {
  const { isImpersonating, stopImpersonating, getEffectiveUserInfo } =
    useImpersonation();

  if (!isImpersonating) {
    return null;
  }

  const userInfo = getEffectiveUserInfo();

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <User className="h-5 w-5 text-yellow-500 mr-2" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Modo de impersonación activo
            </p>
            <p className="text-xs text-yellow-700">
              Estás creando formularios como: {userInfo.id}
            </p>
          </div>
        </div>
        <Button
          onClick={stopImpersonating}
          variant="outline"
          size="sm"
          className="text-yellow-700 border-yellow-300 hover:bg-yellow-200"
        >
          <X className="h-4 w-4 mr-1" />
          Salir
        </Button>
      </div>
    </div>
  );
}
