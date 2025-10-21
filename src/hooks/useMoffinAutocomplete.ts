import { useState, useCallback, useMemo } from "react";
import { getMoffinApi } from "@/services/moffin-api";
import { validateRFC, validateCURP } from "@/lib/utils";

interface UseMoffinAutocompleteProps {
  fieldType: "rfc" | "curp" | "rfc_calculator";
  enabled: boolean;
}

interface UseMoffinAutocompleteReturn {
  isLoading: boolean;
  error: string | null;
  data: any;
  fetchData: (
    value: string,
    additionalData?: Record<string, any>
  ) => Promise<void>;
  clearData: () => void;
  isValidInput: (value: string) => boolean;
}

export function useMoffinAutocomplete({
  fieldType,
  enabled,
}: UseMoffinAutocompleteProps): UseMoffinAutocompleteReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const isValidInput = useCallback(
    (value: string): boolean => {
      switch (fieldType) {
        case "rfc":
          return validateRFC(value);
        case "curp":
          return validateCURP(value);
        case "rfc_calculator":
          // For RFC calculator, we need name, lastname1, lastname2, and birthdate
          return true; // Will be validated in fetchData
        default:
          return false;
      }
    },
    [fieldType]
  );

  const fetchData = useCallback(
    async (value: string, additionalData?: Record<string, any>) => {
      if (!enabled || !value.trim()) {
        setData(null);
        return;
      }

      const api = getMoffinApi();
      if (!api) {
        setError("Moffin API no está configurada");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let result;

        switch (fieldType) {
          case "rfc":
            if (!isValidInput(value)) {
              throw new Error("RFC inválido");
            }
            result = await api.getRFCData(value.toUpperCase());
            break;

          case "curp":
            if (!isValidInput(value)) {
              throw new Error("CURP inválido");
            }
            result = await api.getCURPData(value.toUpperCase());
            break;

          case "rfc_calculator":
            if (
              !additionalData?.name ||
              !additionalData?.lastName1 ||
              !additionalData?.birthDate
            ) {
              throw new Error("Faltan datos para calcular RFC");
            }
            result = await api.calculateRFC(
              additionalData.name,
              additionalData.lastName1,
              additionalData.lastName2 || "",
              additionalData.birthDate
            );
            break;

          default:
            throw new Error("Tipo de campo no soportado");
        }

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [enabled, fieldType, isValidInput]
  );

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    data,
    fetchData,
    clearData,
    isValidInput,
  };
}

// Hook específico para autocompletado de RFC
export function useRFCAutocomplete(enabled: boolean = true) {
  const autocomplete = useMoffinAutocomplete({ fieldType: "rfc", enabled });

  const getAutocompleteData = useMemo(() => {
    if (!autocomplete.data) return null;

    return {
      razonSocial:
        autocomplete.data.razon_social || autocomplete.data.nombre_completo,
      situacionFiscal: autocomplete.data.situacion_fiscal,
      fechaConstitucion: autocomplete.data.fecha_constitucion,
      domicilio: autocomplete.data.domicilio_fiscal,
    };
  }, [autocomplete.data]);

  return {
    ...autocomplete,
    autocompleteData: getAutocompleteData,
  };
}

// Hook específico para autocompletado de CURP
export function useCURPAutocomplete(enabled: boolean = true) {
  const autocomplete = useMoffinAutocomplete({ fieldType: "curp", enabled });

  const getAutocompleteData = useMemo(() => {
    if (!autocomplete.data) return null;

    return {
      nombres: autocomplete.data.nombres,
      primerApellido: autocomplete.data.primer_apellido,
      segundoApellido: autocomplete.data.segundo_apellido,
      fechaNacimiento: autocomplete.data.fecha_nacimiento,
      sexo: autocomplete.data.sexo,
      entidadNacimiento: autocomplete.data.entidad_nacimiento,
      nacionalidad: autocomplete.data.nacionalidad,
    };
  }, [autocomplete.data]);

  return {
    ...autocomplete,
    autocompleteData: getAutocompleteData,
  };
}

// Hook específico para calculadora de RFC
export function useRFCCalculator(enabled: boolean = true) {
  const autocomplete = useMoffinAutocomplete({
    fieldType: "rfc_calculator",
    enabled,
  });

  const calculateRFC = useCallback(
    async (
      name: string,
      lastName1: string,
      lastName2?: string,
      birthDate?: string
    ) => {
      if (!name || !lastName1 || !birthDate) {
        autocomplete.clearData();
        return;
      }

      await autocomplete.fetchData("", {
        name,
        lastName1,
        lastName2,
        birthDate,
      });
    },
    [autocomplete]
  );

  return {
    ...autocomplete,
    calculateRFC,
    calculatedRFC: autocomplete.data?.rfc,
  };
}

