import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service'; // Asegúrate de que está importado correctamente
import { Service, Offer} from 'src/app/models/service.model';
import { User, UserRole } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class TestDataService {
  constructor(private firebaseSvc: FirebaseService) {}

  // Genera una URL aleatoria para las imágenes
  getRandomImage() {
    const randomNum = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/600/400?random=${randomNum}`;
  }

// Genera datos de prueba
// async generateTestData() {
//     try {
//       // Crear usuarios de prueba
//       const users: User[] = [
//         { uid: this.firebaseSvc.createId(), email: 'user1@test.com', password: 'password1', name: 'Juan Pérez', role: UserRole.Service, favorites: []},
//         { uid: this.firebaseSvc.createId(), email: 'user2@test.com', password: 'password2', name: 'María López', role: UserRole.Service, favorites: []},
//         { uid: this.firebaseSvc.createId(), email: 'user3@test.com', password: 'password3', name: 'Carlos García', role: UserRole.Service, favorites: []},
//         { uid: this.firebaseSvc.createId(), email: 'user4@test.com', password: 'password4', name: 'Ana Torres', role: UserRole.Service, favorites: []},
//         { uid: this.firebaseSvc.createId(), email: 'user5@test.com', password: 'password5', name: 'Luis Gómez', role: UserRole.Service, favorites: []},
//         { uid: this.firebaseSvc.createId(), email: 'user6@test.com', password: 'password6', name: 'Laura Jiménez', role: UserRole.Service, favorites: []},
//         { uid: this.firebaseSvc.createId(), email: 'client1@test.com', password: 'password7', name: 'Sofía Díaz', role: UserRole.Client, favorites: []},
//         { uid: this.firebaseSvc.createId(), email: 'client2@test.com', password: 'password8', name: 'Pedro Sánchez', role: UserRole.Client, favorites: []},
//       ];
  
//       for (const user of users) {
//         // Crea la cuenta en Firebase Authentication
//       const authUser = await this.firebaseSvc.signUp(user);
//       user.uid = authUser.user.uid; // Asigna el UID generado por Firebase Auth

//       // Guarda el usuario en Firestore
//       delete user.password; // No guardes la contraseña en Firestore por seguridad
//       await this.firebaseSvc.setDocument(`users_test/${user.uid}`, user);
//       }
  
//       console.log('Usuarios creados con éxito.');
  
//       // Crear servicios de prueba
//       const services: Service[] = [
//         {
//           id: this.firebaseSvc.createId(),
//           name: 'Glamour Nails Studio',
//           category: 'Belleza',
//           description: 'Ofrecemos tratamientos de belleza para uñas, manicura y pedicura profesional.',
//           providerId: users[0].uid,
//           providerName: users[0].name,
//           imageUrl: this.getRandomImage(),
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//           offers: [
//             { id: this.firebaseSvc.createId(), name: 'Manicure Básico', description: 'Cuidado básico para uñas.', price: 10000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Pedicure Completo', description: 'Hidratación y esmaltado.', price: 15000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Manicure Gel', description: 'Esmaltado en gel duradero.', price: 12000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Tratamiento de Uñas', description: 'Fortalecedor de uñas.', price: 8000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Uñas Acrílicas', description: 'Estilo personalizado.', price: 18000, imageUrl: this.getRandomImage() },
//           ],
//         },
//         {
//           id: this.firebaseSvc.createId(),
//           name: 'Gimnasio Elite',
//           category: 'Fitness',
//           description: 'Un gimnasio de primera clase para todos tus objetivos de fitness.',
//           providerId: users[1].uid,
//           providerName: users[1].name,
//           imageUrl: this.getRandomImage(),
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//           offers: [
//             { id: this.firebaseSvc.createId(), name: 'Entrenamiento Personal', description: 'Sesión con entrenador.', price: 20000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Clases de Yoga', description: 'Clases grupales relajantes.', price: 8000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Clases de Spinning', description: 'Ejercicio en bicicleta.', price: 12000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'CrossFit', description: 'Entrenamiento de alta intensidad.', price: 15000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Zumba', description: 'Ejercicio divertido.', price: 10000, imageUrl: this.getRandomImage() },
//           ],
//         },
//         {
//           id: this.firebaseSvc.createId(),
//           name: 'TechFix Soluciones',
//           category: 'Tecnología',
//           description: 'Reparación y mantenimiento de dispositivos tecnológicos.',
//           providerId: users[2].uid,
//           providerName: users[2].name,
//           imageUrl: this.getRandomImage(),
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//           offers: [
//             { id: this.firebaseSvc.createId(), name: 'Reparación de Pantalla', description: 'Cambio de pantalla.', price: 50000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Formateo de PC', description: 'Optimización del sistema.', price: 20000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Limpieza de Virus', description: 'Eliminación de malware.', price: 15000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Actualización de Software', description: 'Mejora del sistema operativo.', price: 10000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Diagnóstico Técnico', description: 'Análisis del dispositivo.', price: 25000, imageUrl: this.getRandomImage() },
//           ],
//         },
//         {
//           id: this.firebaseSvc.createId(),
//           name: 'Pet Paradise',
//           category: 'Veterinaria',
//           description: 'El mejor cuidado para tu mascota con servicios personalizados.',
//           providerId: users[3].uid,
//           providerName: users[3].name,
//           imageUrl: this.getRandomImage(),
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//           offers: [
//             { id: this.firebaseSvc.createId(), name: 'Consulta Veterinaria', description: 'Revisión médica.', price: 25000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Vacunación', description: 'Vacunas completas.', price: 15000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Peluquería Canina', description: 'Corte y aseo.', price: 30000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Guardería', description: 'Cuidado diario.', price: 40000, imageUrl: this.getRandomImage() },
//             { id: this.firebaseSvc.createId(), name: 'Entrenamiento', description: 'Clases para mascotas.', price: 50000, imageUrl: this.getRandomImage() },
//           ],
//         },
//         {
//             id: this.firebaseSvc.createId(),
//             name: 'Clínica Dental Sonrisas',
//             category: 'Salud',
//             description: 'Especialistas en el cuidado de tu sonrisa, con tratamientos personalizados.',
//             providerId: users[4].uid,
//             providerName: users[4].name,
//             imageUrl: this.getRandomImage(),
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//             offers: [
//               { id: this.firebaseSvc.createId(), name: 'Limpieza Dental', description: 'Elimina sarro y manchas.', price: 15000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Blanqueamiento Dental', description: 'Blanqueamiento seguro y efectivo.', price: 30000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Ortodoncia', description: 'Corrección dental avanzada.', price: 40000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Extracción', description: 'Extracción segura de piezas dentales.', price: 20000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Implantes Dentales', description: 'Solución para piezas dentales perdidas.', price: 60000, imageUrl: this.getRandomImage() },
//             ],
//           },
//           {
//             id: this.firebaseSvc.createId(),
//             name: 'Limpieza Hogar 24/7',
//             category: 'Hogar',
//             description: 'Servicios de limpieza profesional para tu hogar u oficina.',
//             providerId: users[5].uid,
//             providerName: users[5].name,
//             imageUrl: this.getRandomImage(),
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//             offers: [
//               { id: this.firebaseSvc.createId(), name: 'Limpieza Básica', description: 'Limpieza superficial de áreas principales.', price: 18000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Limpieza Profunda', description: 'Limpieza completa y detallada.', price: 30000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Desinfección', description: 'Elimina gérmenes y bacterias.', price: 25000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Limpieza de Ventanas', description: 'Ventanas impecables.', price: 20000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Organización de Espacios', description: 'Organización de closets y áreas.', price: 22000, imageUrl: this.getRandomImage() },
//             ],
//           },
//           {
//             id: this.firebaseSvc.createId(),
//             name: 'Spa Relax & Wellness',
//             category: 'Salud',
//             description: 'Un espacio para relajarte y recuperar energías.',
//             providerId: users[0].uid,
//             providerName: users[0].name,
//             imageUrl: this.getRandomImage(),
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//             offers: [
//               { id: this.firebaseSvc.createId(), name: 'Masaje Relajante', description: 'Ideal para liberar tensiones.', price: 25000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Masaje Descontracturante', description: 'Alivia dolores musculares.', price: 30000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Tratamiento Facial', description: 'Rejuvenecimiento y limpieza profunda.', price: 35000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Aromaterapia', description: 'Relajación con aceites esenciales.', price: 20000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Exfoliación Corporal', description: 'Piel suave y renovada.', price: 30000, imageUrl: this.getRandomImage() },
//             ],
//           },
//           {
//             id: this.firebaseSvc.createId(),
//             name: 'Taller Automotriz SpeedFix',
//             category: 'Automotriz',
//             description: 'Reparación y mantenimiento de vehículos de todas las marcas.',
//             providerId: users[1].uid,
//             providerName: users[1].name,
//             imageUrl: this.getRandomImage(),
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//             offers: [
//               { id: this.firebaseSvc.createId(), name: 'Cambio de Aceite', description: 'Cambio de aceite y filtro.', price: 15000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Alineación y Balanceo', description: 'Asegura estabilidad en tu auto.', price: 25000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Frenos', description: 'Revisión y cambio de frenos.', price: 30000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Revisión General', description: 'Diagnóstico completo.', price: 35000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Batería', description: 'Cambio de batería.', price: 40000, imageUrl: this.getRandomImage() },
//             ],
//           },
//           {
//             id: this.firebaseSvc.createId(),
//             name: 'Academia de Música Harmony',
//             category: 'Educación',
//             description: 'Clases de música para niños, jóvenes y adultos.',
//             providerId: users[2].uid,
//             providerName: users[2].name,
//             imageUrl: this.getRandomImage(),
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//             offers: [
//               { id: this.firebaseSvc.createId(), name: 'Clases de Guitarra', description: 'Aprende a tocar guitarra.', price: 15000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Clases de Piano', description: 'Clases personalizadas de piano.', price: 20000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Clases de Canto', description: 'Desarrolla tu voz.', price: 25000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Clases de Violín', description: 'Clases individuales de violín.', price: 18000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Taller de Composición', description: 'Crea tu propia música.', price: 30000, imageUrl: this.getRandomImage() },
//             ],
//           },
//           {
//             id: this.firebaseSvc.createId(),
//             name: 'Agencia de Viajes WorldExplorer',
//             category: 'Turismo',
//             description: 'Organizamos tus viajes con las mejores experiencias.',
//             providerId: users[3].uid,
//             providerName: users[3].name,
//             imageUrl: this.getRandomImage(),
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//             offers: [
//               { id: this.firebaseSvc.createId(), name: 'Paquete a Europa', description: 'Tour por las principales ciudades europeas.', price: 1000000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Crucero por el Caribe', description: 'Vacaciones en un crucero de lujo.', price: 800000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Turismo Aventura', description: 'Excursiones y deportes extremos.', price: 500000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Viaje Nacional', description: 'Paquetes económicos dentro del país.', price: 200000, imageUrl: this.getRandomImage() },
//               { id: this.firebaseSvc.createId(), name: 'Luna de Miel', description: 'Plan perfecto para recién casados.', price: 1200000, imageUrl: this.getRandomImage() },
//             ],
//           },
          
//         // Agrega 6 servicios más en el mismo formato...
//       ];
  
//       for (const service of services) {
//         await this.firebaseSvc.setDocument(`services/${service.id}`, service);
//       }
  
//       console.log('Servicios creados con éxito.');
//     } catch (error) {
//       console.error('Error al generar datos de prueba:', error);
//     }
//   }
  
}
