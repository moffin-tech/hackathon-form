import { FormConfig } from "@/types/form";

// Formulario de Onboarding Financiero (Persona Física vs Persona Moral)
export const financialOnboardingForm: FormConfig = {
  id: "financial-onboarding",
  title: "Onboarding Digital - Registro de Cliente",
  description:
    "Completar este formulario nos permitirá ofrecerte una experiencia personalizada y cumplir con la normativa vigente.",
  sections: [
    {
      id: "welcome",
      title: "Bienvenida",
      description:
        "Bienvenido al proceso de registro. Completar este formulario nos permitirá ofrecerte una experiencia personalizada y cumplir con la normativa vigente.",
      fields: [
        {
          id: "client_type",
          type: "radio",
          label: "Tipo de cliente",
          required: true,
          options: [
            { value: "persona_fisica", label: "Persona Física" },
            { value: "persona_moral", label: "Persona Moral" },
          ],
        },
      ],
    },
    {
      id: "persona_fisica_data",
      title: "Datos de Persona Física",
      description: "Información requerida para personas físicas",
      conditional: {
        dependsOn: "client_type",
        showWhen: "persona_fisica",
      },
      fields: [
        {
          id: "nombre_completo",
          type: "text",
          label: "Nombre completo",
          placeholder: "Ingresa tu nombre completo",
          required: true,
          validation: {
            minLength: 2,
            maxLength: 100,
          },
        },
        {
          id: "curp",
          type: "text",
          label: "CURP",
          placeholder: "Ingresa tu CURP",
          required: true,
          validation: {
            pattern: "^[A-Z][AEIOUX][A-Z]{2}\\d{6}[HM][A-Z]{5}[A-Z0-9]\\d$",
          },
          autocomplete: {
            enabled: true,
            apiEndpoint: "/query/curp-data",
          },
        },
        {
          id: "rfc",
          type: "text",
          label: "RFC con homoclave",
          placeholder: "Ingresa tu RFC",
          required: true,
          validation: {
            pattern: "^[A-ZÑ&]{3,4}\\d{6}[A-Z0-9]{3}$",
          },
          autocomplete: {
            enabled: true,
            apiEndpoint: "/query/rfc-data",
          },
        },
        {
          id: "ine_file",
          type: "file",
          label: "INE (Identificación Oficial)",
          required: true,
          validation: {
            pattern: "\\.(pdf|jpg|jpeg|png)$",
          },
        },
        {
          id: "comprobante_domicilio",
          type: "file",
          label: "Comprobante de domicilio",
          required: true,
          validation: {
            pattern: "\\.(pdf|jpg|jpeg|png)$",
          },
        },
        {
          id: "ocupacion",
          type: "text",
          label: "Ocupación / Actividad principal",
          placeholder: "Describe tu ocupación o actividad principal",
          required: true,
        },
      ],
    },
    {
      id: "persona_moral_data",
      title: "Datos de Persona Moral",
      description: "Información requerida para empresas",
      conditional: {
        dependsOn: "client_type",
        showWhen: "persona_moral",
      },
      fields: [
        {
          id: "razon_social",
          type: "text",
          label: "Razón social",
          placeholder: "Nombre de la empresa",
          required: true,
          validation: {
            minLength: 2,
            maxLength: 200,
          },
        },
        {
          id: "rfc_empresa",
          type: "text",
          label: "RFC de empresa",
          placeholder: "Ingresa el RFC de la empresa",
          required: true,
          validation: {
            pattern: "^[A-ZÑ&]{3,4}\\d{6}[A-Z0-9]{3}$",
          },
          autocomplete: {
            enabled: true,
            apiEndpoint: "/query/rfc-data",
          },
        },
        {
          id: "acta_constitutiva",
          type: "file",
          label: "Acta constitutiva (PDF)",
          required: true,
          validation: {
            pattern: "\\.(pdf)$",
          },
        },
        {
          id: "poder_notarial",
          type: "file",
          label: "Poder notarial del representante legal",
          required: true,
          validation: {
            pattern: "\\.(pdf)$",
          },
        },
        {
          id: "identificacion_representante",
          type: "file",
          label: "Identificación oficial del representante",
          required: true,
          validation: {
            pattern: "\\.(pdf|jpg|jpeg|png)$",
          },
        },
        {
          id: "comprobante_domicilio_fiscal",
          type: "file",
          label: "Comprobante de domicilio fiscal",
          required: true,
          validation: {
            pattern: "\\.(pdf|jpg|jpeg|png)$",
          },
        },
      ],
    },
    {
      id: "service_validation",
      title: "Validación de Servicio",
      description: "¿Qué tipo de servicio deseas contratar?",
      fields: [
        {
          id: "tipo_servicio",
          type: "radio",
          label: "Tipo de servicio",
          required: true,
          options: [
            { value: "consulta", label: "Consulta de información" },
            { value: "credito", label: "Solicitud de crédito" },
          ],
        },
      ],
    },
    {
      id: "credito_details",
      title: "Detalles para Solicitud de Crédito",
      description:
        "Información adicional requerida para solicitudes de crédito",
      conditional: {
        dependsOn: "tipo_servicio",
        showWhen: "credito",
      },
      fields: [
        {
          id: "ingreso_mensual",
          type: "number",
          label: "Ingreso mensual estimado",
          placeholder: "Ingresa tu ingreso mensual",
          required: true,
          validation: {
            min: 1000,
            max: 10000000,
          },
        },
        {
          id: "estados_financieros",
          type: "file",
          label: "Estados financieros",
          required: true,
          validation: {
            pattern: "\\.(pdf)$",
          },
        },
        {
          id: "referencia_1",
          type: "text",
          label: "Referencia personal 1 (Nombre y teléfono)",
          placeholder: "Nombre - Teléfono",
          required: true,
        },
        {
          id: "referencia_2",
          type: "text",
          label: "Referencia personal 2 (Nombre y teléfono)",
          placeholder: "Nombre - Teléfono",
          required: true,
        },
        {
          id: "referencia_3",
          type: "text",
          label: "Referencia personal 3 (Nombre y teléfono)",
          placeholder: "Nombre - Teléfono",
          required: true,
        },
        {
          id: "monto_credito",
          type: "select",
          label: "Monto de crédito deseado",
          required: true,
          options: [
            { value: "50000", label: "$50,000 - $100,000" },
            { value: "250000", label: "$100,000 - $250,000" },
            { value: "500000", label: "$250,000 - $500,000" },
            { value: "1000000", label: "$500,000 - $1,000,000" },
          ],
        },
      ],
    },
    {
      id: "consent_and_channels",
      title: "Consentimiento y Canales",
      description: "Términos y condiciones y preferencias de contacto",
      fields: [
        {
          id: "acepta_terminos",
          type: "checkbox",
          label:
            "Acepto términos y condiciones, así como la consulta en buró de crédito y listas de prevención de fraude",
          required: true,
        },
        {
          id: "preferencia_contacto",
          type: "multiselect",
          label: "Preferencia de contacto",
          required: true,
          options: [
            { value: "email", label: "Email" },
            { value: "telefono", label: "Teléfono" },
            { value: "whatsapp", label: "WhatsApp" },
          ],
        },
        {
          id: "email_contacto",
          type: "email",
          label: "Email de contacto",
          placeholder: "tu@email.com",
          required: true,
          conditional: {
            dependsOn: "preferencia_contacto",
            showWhen: "email",
          },
        },
        {
          id: "telefono_contacto",
          type: "tel",
          label: "Teléfono de contacto",
          placeholder: "55 1234 5678",
          required: true,
          conditional: {
            dependsOn: "preferencia_contacto",
            showWhen: ["telefono", "whatsapp"],
          },
        },
      ],
    },
  ],
  settings: {
    allowMultiSession: true,
    allowEdit: true,
    autoSave: true,
    showProgress: true,
    requireAuth: false,
  },
  permissions: {
    canView: ["*"],
    canEdit: ["*"],
    canSubmit: ["*"],
  },
};

// Formulario de Onboarding de Empleados
export const employeeOnboardingForm: FormConfig = {
  id: "employee-onboarding",
  title: "Onboarding de Empleados",
  description: "Proceso de incorporación de nuevos empleados",
  sections: [
    {
      id: "personal_data",
      title: "Datos Personales",
      fields: [
        {
          id: "nombre_completo",
          type: "text",
          label: "Nombre completo",
          required: true,
        },
        {
          id: "fecha_nacimiento",
          type: "date",
          label: "Fecha de nacimiento",
          required: true,
        },
        {
          id: "direccion",
          type: "text",
          label: "Dirección completa",
          required: true,
        },
        {
          id: "contacto_emergencia",
          type: "text",
          label: "Contacto de emergencia",
          required: true,
        },
      ],
    },
    {
      id: "employment_type",
      title: "Tipo de Contratación",
      fields: [
        {
          id: "tipo_contrato",
          type: "radio",
          label: "Tipo de contrato",
          required: true,
          options: [
            { value: "prueba", label: "A prueba" },
            { value: "indefinido", label: "Indefinido" },
          ],
        },
      ],
    },
    {
      id: "prueba_documents",
      title: "Documentos para Contrato a Prueba",
      conditional: {
        dependsOn: "tipo_contrato",
        showWhen: "prueba",
      },
      fields: [
        {
          id: "curp_empleado",
          type: "text",
          label: "CURP",
          required: true,
          autocomplete: {
            enabled: true,
            apiEndpoint: "/query/curp-data",
          },
        },
        {
          id: "ine_empleado",
          type: "file",
          label: "INE",
          required: true,
        },
        {
          id: "biometricos",
          type: "checkbox",
          label: "Autorizo la toma de datos biométricos",
          required: true,
        },
        {
          id: "contrato_prueba",
          type: "file",
          label: "Contrato de trabajo",
          required: true,
        },
      ],
    },
    {
      id: "indefinido_documents",
      title: "Documentos para Contrato Indefinido",
      conditional: {
        dependsOn: "tipo_contrato",
        showWhen: "indefinido",
      },
      fields: [
        {
          id: "imss",
          type: "text",
          label: "Número de IMSS",
          required: true,
        },
        {
          id: "biometricos_indefinido",
          type: "checkbox",
          label: "Autorizo la toma de datos biométricos",
          required: true,
        },
        {
          id: "referencias_laborales",
          type: "file",
          label: "Referencias laborales",
          required: true,
        },
        {
          id: "csf",
          type: "text",
          label: "CSF (Constancia de Situación Fiscal)",
          required: true,
          autocomplete: {
            enabled: true,
            apiEndpoint: "/query/sat/csf",
          },
        },
        {
          id: "contrato_indefinido",
          type: "file",
          label: "Contrato de trabajo indefinido",
          required: true,
        },
      ],
    },
    {
      id: "benefits",
      title: "Beneficios y Prestaciones",
      fields: [
        {
          id: "prestaciones",
          type: "multiselect",
          label: "Prestaciones deseadas",
          required: false,
          options: [
            { value: "seguro_medico", label: "Seguro médico" },
            { value: "vales_despensa", label: "Vales de despensa" },
            { value: "plan_retiro", label: "Plan de retiro" },
            { value: "bonos", label: "Bonos por desempeño" },
          ],
        },
      ],
    },
  ],
  settings: {
    allowMultiSession: true,
    allowEdit: true,
    autoSave: true,
    showProgress: true,
    requireAuth: false,
  },
  permissions: {
    canView: ["*"],
    canEdit: ["*"],
    canSubmit: ["*"],
  },
};

// Formulario de Onboarding para Proveedores
export const supplierOnboardingForm: FormConfig = {
  id: "supplier-onboarding",
  title: "Onboarding para Proveedores",
  description: "Registro de nuevos proveedores",
  sections: [
    {
      id: "fiscal_data",
      title: "Datos Fiscales",
      fields: [
        {
          id: "rfc_proveedor",
          type: "text",
          label: "RFC",
          required: true,
          autocomplete: {
            enabled: true,
            apiEndpoint: "/query/rfc-data",
          },
        },
        {
          id: "razon_social_proveedor",
          type: "text",
          label: "Razón social",
          required: true,
        },
        {
          id: "cuenta_bancaria",
          type: "text",
          label: "Cuenta bancaria",
          required: true,
        },
      ],
    },
    {
      id: "service_type",
      title: "Tipo de Servicio",
      fields: [
        {
          id: "tipo_servicio_proveedor",
          type: "radio",
          label: "Tipo de servicio/producto",
          required: true,
          options: [
            { value: "servicios_recurrentes", label: "Servicios recurrentes" },
            { value: "productos", label: "Productos" },
          ],
        },
      ],
    },
    {
      id: "recurrent_services",
      title: "Servicios Recurrentes",
      conditional: {
        dependsOn: "tipo_servicio_proveedor",
        showWhen: "servicios_recurrentes",
      },
      fields: [
        {
          id: "calendario_facturacion",
          type: "text",
          label: "Calendario estimado de facturación",
          required: true,
        },
      ],
    },
    {
      id: "products_info",
      title: "Información de Productos",
      conditional: {
        dependsOn: "tipo_servicio_proveedor",
        showWhen: "productos",
      },
      fields: [
        {
          id: "catalogo",
          type: "file",
          label: "Catálogo de productos",
          required: true,
        },
        {
          id: "lista_precios",
          type: "file",
          label: "Lista de precios",
          required: true,
        },
        {
          id: "condiciones_entrega",
          type: "text",
          label: "Condiciones de entrega",
          required: true,
        },
      ],
    },
    {
      id: "compliance",
      title: "Validaciones de Cumplimiento",
      fields: [
        {
          id: "constancia_fiscal",
          type: "file",
          label: "Constancia fiscal",
          required: true,
        },
        {
          id: "carta_cumplimiento",
          type: "file",
          label: "Carta de cumplimiento de normativas",
          required: true,
        },
      ],
    },
  ],
  settings: {
    allowMultiSession: true,
    allowEdit: true,
    autoSave: true,
    showProgress: true,
    requireAuth: false,
  },
  permissions: {
    canView: ["*"],
    canEdit: ["*"],
    canSubmit: ["*"],
  },
};

export const sampleForms = [
  financialOnboardingForm,
  employeeOnboardingForm,
  supplierOnboardingForm,
];
