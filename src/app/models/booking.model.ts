export interface Booking {
  id: string; // ID único de la reserva
  serviceId: string; // ID del servicio reservado
  offerId: string; // ID de la oferta reservada
  clientId: string; // ID del cliente que realiza la reserva
  clientName?: string; // Nombre del cliente
  serviceName?: string; // Nombre del servicio reservado
  providerId: string; // ID del proveedor del servicio
  providerName?: string; // Nombre del proveedor para visualización

  /* FECHAS Y HORARIOS */
  date: string; // Fecha de la reserva
  startTime: string; // Hora de inicio
  endTime: string; // Hora de fin

  /* ESTADO DE LA RESERVA */
  status: 'pending' | 'confirmed' | 'cancelled'; // Estado actual de la reserva

  /* DATOS TEMPORALES */
  createdAt: string; // Fecha de creación de la reserva
  updatedAt?: string; // Última actualización de la reserva
}
