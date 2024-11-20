export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  providerId: string; // UID del proveedor que creó el servicio
  providerName: string; // Nombre del proveedor
  imageUrl?: string; // URL de la imagen referencial del servicio
  createdAt: string; // Fecha de creación
  updatedAt: string; // Fecha de última actualización
  offers: Offer[]; // Lista de ofertas relacionadas al servicio
}

export interface Offer {
  id: string; // ID único de la oferta
  name: string;
  description: string;
  price: number; // Precio de la oferta
  imageUrl?: string; // Imagen opcional de la oferta
}

