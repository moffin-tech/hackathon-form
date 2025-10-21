// Moffin Solutions API Service
// Documentation: https://solutions-docs.moffin.mx/apis

export interface MoffinApiConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
}

export interface MoffinTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface RFCData {
  rfc: string;
  razon_social?: string;
  nombre_completo?: string;
  situacion_fiscal?: string;
  fecha_constitucion?: string;
  domicilio_fiscal?: {
    calle?: string;
    numero_exterior?: string;
    numero_interior?: string;
    colonia?: string;
    municipio?: string;
    estado?: string;
    cp?: string;
  };
}

export interface CURPData {
  curp: string;
  nombres?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  fecha_nacimiento?: string;
  sexo?: string;
  entidad_nacimiento?: string;
  nacionalidad?: string;
}

class MoffinApiService {
  private config: MoffinApiConfig;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: MoffinApiConfig) {
    this.config = config;
  }

  private async getAccessToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.statusText}`);
      }

      const tokenData: MoffinTokenResponse = await response.json();
      this.token = tokenData.access_token;
      this.tokenExpiry = Date.now() + tokenData.expires_in * 1000;

      return this.token;
    } catch (error) {
      console.error("Error getting access token:", error);
      throw error;
    }
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // RFC Calculator
  async calculateRFC(
    name: string,
    lastName1: string,
    lastName2: string,
    birthDate: string
  ): Promise<{ rfc: string }> {
    return this.makeRequest("/query/rfc-calculator", {
      nombre: name,
      apellido_paterno: lastName1,
      apellido_materno: lastName2,
      fecha_nacimiento: birthDate,
    });
  }

  // RFC Data Query
  async getRFCData(rfc: string): Promise<RFCData> {
    return this.makeRequest("/query/rfc-data", { rfc });
  }

  // CURP Data Query
  async getCURPData(curp: string): Promise<CURPData> {
    return this.makeRequest("/query/curp-data", { curp });
  }

  // CRF Query (Constancia de Registro Fiscal)
  async getCRF(rfc: string): Promise<any> {
    return this.makeRequest("/query/crf", { rfc });
  }

  // SAT Profile Query
  async getSATProfile(rfc: string): Promise<any> {
    return this.makeRequest("/query/sat/profile", { rfc });
  }

  // SAT CSF Query (Constancia de Situación Fiscal)
  async getSATCSF(rfc: string): Promise<any> {
    return this.makeRequest("/query/sat/csf", { rfc });
  }

  // Company Shareholders Query
  async getCompanyShareholders(rfc: string): Promise<any> {
    return this.makeRequest("/query/company-shareholders", { rfc });
  }

  // Job History Query
  async getJobHistory(rfc: string): Promise<any> {
    return this.makeRequest("/query/job-history", { rfc });
  }

  // SAT Compliance Opinion Query
  async getSATComplianceOpinion(rfc: string): Promise<any> {
    return this.makeRequest("/query/sat/compliance-opinion", { rfc });
  }

  // SAT Invoice Query
  async getSATInvoice(
    rfc: string,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    return this.makeRequest("/query/sat/invoice", {
      rfc,
      fecha_inicio: startDate,
      fecha_fin: endDate,
    });
  }

  // Query Retrieval
  async getQuery(queryId: string): Promise<any> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.config.baseUrl}/query/${queryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Query retrieval failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get All Queries
  async getAllQueries(): Promise<any> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.config.baseUrl}/query`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Query list failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Create Form Configuration
  async createFormConfig(formData: {
    name: string;
    slug: string;
    accountType: "PF" | "PM";
    serviceQueries: {
      bureauPM: boolean;
      bureauPF: boolean;
      prospectorPF: boolean;
      satBlackList: boolean;
      satRFC: boolean;
      renapoCurp: boolean;
      imssJobHistory: boolean;
      jumioIdValidation: boolean;
      caBlacklist: boolean;
    };
  }): Promise<any> {
    return this.makeRequest("/formconfigs", formData);
  }

  // Get Organization Configuration
  async getOrganizationConfig(organizationId: string): Promise<{
    id: string;
    name: string;
    apiKey: string;
    baseUrl: string;
  }> {
    // This would typically come from your database
    // For now, we'll return a mock structure
    return {
      id: organizationId,
      name: `Organización ${organizationId}`,
      apiKey: process.env.MOFFIN_API_KEY || "",
      baseUrl:
        process.env.MOFFIN_BASE_URL || "https://staging.moffin.mx/api/v1",
    };
  }
}

// Singleton instance
let moffinApi: MoffinApiService | null = null;

export function initializeMoffinApi(config: MoffinApiConfig): MoffinApiService {
  if (!moffinApi) {
    moffinApi = new MoffinApiService(config);
  }
  return moffinApi;
}

export function getMoffinApi(): MoffinApiService | null {
  return moffinApi;
}

// Export the service class for direct usage if needed
export { MoffinApiService };
