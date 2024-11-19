export interface Service {
    id: string;
    name: string;
    category: string;
    description: string;
    providerId: string; // UID del proveedor que creó el servicio
    providerName: string; // Nombre del proveedor
    timestamp: string; // Fecha de creación o última actualización
  }
  