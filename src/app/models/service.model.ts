export interface Service {
  /* INFORMACION DEL SERVICIO */
  id: string; // ID único del servicio
  name: string; // Nombre del servicio
  description: string; // Descripción breve
  imageUrl?: string; // URL de la imagen referencial
  category: string; // Categoría del servicio

  /* OFERTAS RELACIONADAS */
  offers: Offer[]; // Lista de ofertas disponibles para este servicio

  /* RELACIÓN CON EL DUEÑO */
  ownerId: string; // UID del usuario que creó el servicio (proveedor)
  ownerName?: string; // Nombre del proveedor para visualización rápida

  /* INFORMACIÓN COMPLEMENTARIA */
  ratingAverage?: number; // Calificación promedio basada en reviews
  reviews?: { clientId: string; comment: string; rating: number }[]; // Lista de reseñas de clientes
  clientInteractions?: string[]; // Lista de IDs de clientes que interactuaron con este servicio

  /* DATOS TEMPORALES */
  createdAt: string; // Fecha de creación del servicio
  updatedAt?: string; // Fecha de última actualización

  /* DISPONIBILIDAD */
  availableDays?: string[]; // Días disponibles (e.g., ["monday", "tuesday"])
  availableHours?: { startTime: string; endTime: string }[]; // Horarios de apertura y cierre
  blockedTimeSlots?: { date: string; startTime: string; endTime: string; reason: string }[]; // Horarios no disponibles
}

export interface Offer {
  id: string; // ID único de la oferta
  name: string; // Nombre de la oferta
  description: string; // Descripción breve
  price: number; // Precio de la oferta
  imageUrl?: string; // Imagen opcional de la oferta

  /* DATOS DE AGENDA */
  duration: number; // Duración en minutos
}


