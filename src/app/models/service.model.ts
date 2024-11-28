export interface Service {

  /* INFORMACION DEL SERVICIO */
  id: string; // ID del Servicio
  name: string; // Nombre del Servicio
  description: string; // Descripcion del Servicio
  imageUrl?: string; // URL de la imagen referencial del servicio
  category: string; // Categoria del Servicio
  
  /* OFERTAS DEL SERVICIO */
  offers: Offer[]; // Lista de ofertas relacionadas al servicio
  
  /* DUEÑO DEL SERVICIO */
  ownerId: string; // UID del proveedor que creó el servicio

  /* MARCAS TEMPORALES */
  createdAt: string; // Fecha de creación
  updatedAt: string; // Fecha de última actualización

  /* DATOS DE AGENDA */
  availableDays: string[]; // Días disponibles (e.g., ["monday", "tuesday"])
  availableHours: { startTime: string; endTime: string }[]; // Horarios disponibles de apertura y cierre - solo se utiliza el valor [0]
  blockedTimeSlots: { date: string; startTime: string; endTime: string; reason: string }[]; // Horarios bloqueados
}

export interface Offer {
  /* INFORMACION DE LA OFERTA */
  id: string; // ID único de la oferta
  name: string;
  description: string;
  price: number; // Precio de la oferta
  imageUrl?: string; // Imagen opcional de la oferta

  /* DATOS DE AGENDA */
  duration: number; // Duración en minutos
}

