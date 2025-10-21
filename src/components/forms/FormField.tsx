import React, { useState, useEffect } from "react";
import { FormField as FormFieldType } from "@/types/form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  useRFCAutocomplete,
  useCURPAutocomplete,
  useRFCCalculator,
} from "@/hooks/useMoffinAutocomplete";
import {
  validateEmail,
  validatePhone,
  validateRFC,
  validateCURP,
  formatPhone,
  formatRFC,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export function FormField({
  field,
  value,
  onChange,
  error,
  disabled,
}: FormFieldProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Autocomplete hooks
  const rfcAutocomplete = useRFCAutocomplete(
    field.autocomplete?.enabled && field.type === "text"
  );
  const curpAutocomplete = useCURPAutocomplete(
    field.autocomplete?.enabled && field.type === "text"
  );
  const rfcCalculator = useRFCCalculator(
    field.autocomplete?.enabled && field.type === "text"
  );

  // Validation function
  const validateField = (val: string): string | null => {
    if (field.required && (!val || val.trim() === "")) {
      return "Este campo es obligatorio";
    }

    if (val && field.validation) {
      if (field.validation.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(val)) {
          return "Formato inválido";
        }
      }

      if (
        field.validation.minLength &&
        val.length < field.validation.minLength
      ) {
        return `Mínimo ${field.validation.minLength} caracteres`;
      }

      if (
        field.validation.maxLength &&
        val.length > field.validation.maxLength
      ) {
        return `Máximo ${field.validation.maxLength} caracteres`;
      }

      if (field.validation.min && Number(val) < field.validation.min) {
        return `Valor mínimo: ${field.validation.min}`;
      }

      if (field.validation.max && Number(val) > field.validation.max) {
        return `Valor máximo: ${field.validation.max}`;
      }
    }

    // Specific validations based on field type
    if (field.type === "email" && val && !validateEmail(val)) {
      return "Email inválido";
    }

    if (field.type === "tel" && val && !validatePhone(val)) {
      return "Teléfono inválido";
    }

    return null;
  };

  // Handle input change
  const handleChange = (newValue: string) => {
    setLocalError(null);
    onChange(newValue);

    // Auto-format based on field type
    if (field.type === "tel" && newValue) {
      onChange(formatPhone(newValue));
    } else if (
      field.type === "text" &&
      field.label.toLowerCase().includes("rfc") &&
      newValue
    ) {
      onChange(formatRFC(newValue));
    }

    // Trigger autocomplete for specific fields
    if (field.autocomplete?.enabled) {
      if (field.label.toLowerCase().includes("rfc") && validateRFC(newValue)) {
        rfcAutocomplete.fetchData(newValue);
      } else if (
        field.label.toLowerCase().includes("curp") &&
        validateCURP(newValue)
      ) {
        curpAutocomplete.fetchData(newValue);
      }
    }
  };

  // Handle blur validation
  const handleBlur = () => {
    const validationError = validateField(value);
    setLocalError(validationError);
  };

  const displayError = error || localError || undefined;

  // Render different field types
  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
      case "date":
        return (
          <Input
            type={field.type}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={field.placeholder}
            disabled={disabled || isValidating}
            error={displayError}
            className="w-full"
          />
        );

      case "select":
        return (
          <div className="w-full">
            <select
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              onBlur={handleBlur}
              disabled={disabled}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                displayError && "border-red-500 focus-visible:ring-red-500"
              )}
            >
              <option value="">Selecciona una opción</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {displayError && (
              <p className="mt-1 text-sm text-red-600">{displayError}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={disabled}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
            {displayError && (
              <p className="mt-1 text-sm text-red-600">{displayError}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="text-sm">{field.label}</span>
            {displayError && (
              <p className="mt-1 text-sm text-red-600">{displayError}</p>
            )}
          </div>
        );

      case "file":
        return (
          <div className="w-full">
            <input
              type="file"
              onChange={(e) => onChange(e.target.files?.[0] || null)}
              disabled={disabled}
              accept={field.validation?.pattern || "*"}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                displayError && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {displayError && (
              <p className="mt-1 text-sm text-red-600">{displayError}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {renderField()}

      {/* Autocomplete suggestions */}
      {field.autocomplete?.enabled && (
        <div className="space-y-2">
          {rfcAutocomplete.isLoading && (
            <div className="text-sm text-blue-600">Buscando datos...</div>
          )}

          {rfcAutocomplete.error && (
            <div className="text-sm text-red-600">{rfcAutocomplete.error}</div>
          )}

          {rfcAutocomplete.autocompleteData && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-sm font-medium text-blue-900">
                Datos encontrados:
              </h4>
              <div className="mt-2 space-y-1 text-sm text-blue-800">
                {rfcAutocomplete.autocompleteData.razonSocial && (
                  <div>
                    <strong>Razón Social:</strong>{" "}
                    {rfcAutocomplete.autocompleteData.razonSocial}
                  </div>
                )}
                {rfcAutocomplete.autocompleteData.situacionFiscal && (
                  <div>
                    <strong>Situación Fiscal:</strong>{" "}
                    {rfcAutocomplete.autocompleteData.situacionFiscal}
                  </div>
                )}
                {rfcAutocomplete.autocompleteData.domicilio && (
                  <div>
                    <strong>Domicilio:</strong>{" "}
                    {[
                      rfcAutocomplete.autocompleteData.domicilio.calle,
                      rfcAutocomplete.autocompleteData.domicilio
                        .numero_exterior,
                      rfcAutocomplete.autocompleteData.domicilio.colonia,
                      rfcAutocomplete.autocompleteData.domicilio.municipio,
                      rfcAutocomplete.autocompleteData.domicilio.estado,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}

          {curpAutocomplete.autocompleteData && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <h4 className="text-sm font-medium text-green-900">
                Datos encontrados:
              </h4>
              <div className="mt-2 space-y-1 text-sm text-green-800">
                {curpAutocomplete.autocompleteData.nombres && (
                  <div>
                    <strong>Nombres:</strong>{" "}
                    {curpAutocomplete.autocompleteData.nombres}
                  </div>
                )}
                {curpAutocomplete.autocompleteData.primerApellido && (
                  <div>
                    <strong>Apellidos:</strong>{" "}
                    {curpAutocomplete.autocompleteData.primerApellido}{" "}
                    {curpAutocomplete.autocompleteData.segundoApellido}
                  </div>
                )}
                {curpAutocomplete.autocompleteData.fechaNacimiento && (
                  <div>
                    <strong>Fecha de Nacimiento:</strong>{" "}
                    {curpAutocomplete.autocompleteData.fechaNacimiento}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
