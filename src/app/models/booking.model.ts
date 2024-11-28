export interface Booking {
    id: string; // ID único de la reserva
    serviceId: string; // ID del servicio
    offerId: string; // ID de la oferta
    userId: string; // ID del cliente
    date: string; // Fecha
    startTime: string; // Hora de inicio
    endTime: string; // Hora de fin
    status: 'pending' | 'confirmed' | 'cancelled'; // Estado de la reserva
  }
  