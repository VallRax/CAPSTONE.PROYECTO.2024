export enum UserRole {
  Client = 'client', // Usuario cliente
  Service = 'service', // Prestador de servicios
}

export interface User {
  uid: string; // ID único del usuario
  email: string; // Correo electrónico
  password?: string; // Contraseña
  name: string; // Nombre del usuario
  lastName: string; // Apellido del usuario
  rut: string; // RUT o identificación única
  roles: UserRole[]; // Lista de roles del usuario
  profileImageUrl?: string; // Imagen de perfil
  createdAt: string; // Fecha de creación
  updatedAt?: string; // Fecha de última actualización

  /* Datos comunes */
  contactNumber?: string; // Número de contacto
  location?: { 
    region?: string; // Región o estado
    comuna?: string; // Comuna
    address?: string; // Dirección completa
    addressNumber?: string; // Número de la dirección
    department?: string; // Departamento o unidad específica
  }; // Ubicación física

  /* Datos específicos para clientes */
  favorites?: string[]; // Lista de IDs de servicios favoritos
  bookings?: string[]; // Lista de IDs de reservas realizadas

  /* Datos específicos para proveedores de servicios */
  servicesOffered?: string[]; // IDs de servicios creados por el usuario
  ratingAverage?: number; // Calificación promedio basada en reviews
  reviews?: { clientId: string; comment: string; rating: number }[]; // Lista de reseñas de clientes
}
