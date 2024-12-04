import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Service, Offer } from 'src/app/models/service.model';
import { User, UserRole } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class TestDataService {
  constructor(private firebaseSvc: FirebaseService) {}

  test_users: User[] = [
    {
      uid: this.firebaseSvc.createId(),
      email: 'user1@test.com',
      password: 'password1',
      name: 'Juan Pérez',
      lastName: 'Pérez',
      rut: '12345678-9',
      roles: [UserRole.Service],
      createdAt: new Date().toISOString(),
    },
    {
      uid: this.firebaseSvc.createId(),
      email: 'user2@test.com',
      password: 'password2',
      name: 'María López',
      lastName: 'López',
      rut: '98765432-1',
      roles: [UserRole.Service],
      createdAt: new Date().toISOString(),
    },
    {
      uid: this.firebaseSvc.createId(),
      email: 'user3@test.com',
      password: 'password3',
      name: 'Carlos García',
      lastName: 'García',
      rut: '11223344-5',
      roles: [UserRole.Service],
      createdAt: new Date().toISOString(),
    },
  ];

  // Genera una URL aleatoria para imágenes
  getRandomImage() {
    const randomNum = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/600/400?random=${randomNum}`;
  }

  // Sube una imagen aleatoria a Firebase y retorna la URL pública
// Sube una imagen aleatoria a Firebase y retorna la URL pública
async uploadRandomImage(
  userId: string,
  fileName: string,
  type: 'profile' | 'service' | 'offer',
  isTest: boolean,
  retries: number = 3 // Número máximo de reintentos
): Promise<string> {
  const imageUrl = this.getRandomImage();
  const fileSuffix = isTest ? `test-${type}` : type;
  const folder =
    type === 'profile' ? 'profile-images' :
    type === 'service' ? 'service-images' :
    'offer-images';

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], `${fileSuffix}-${fileName}`, { type: blob.type });
    const uploadedUrl = await this.firebaseSvc.uploadImage(`${folder}/${userId}/${file.name}`, file);
    return uploadedUrl;
  } catch (error) {
    console.error(`Error al subir imagen: ${fileName}, intentando de nuevo...`, error);
    if (retries > 0) {
      return this.uploadRandomImage(userId, fileName, type, isTest, retries - 1);
    } else {
      console.warn(`No se pudo subir la imagen: ${fileName}. Se usará una URL random.`);
      return this.getRandomImage(); // Devuelve una URL aleatoria en caso de fallo persistente
    }
  }
}

  

  async generateTestData() {
    try {
      const users = await this.firebaseSvc.getCollection('users'); // Cargar usuarios existentes
      if (users.length === 0) {
        console.log('No hay usuarios. Crea usuarios primero.');
        return;
      }
      await this.generateTestServicesAndOffers(this.test_users);
    } catch (error) {
      console.error('Error al generar datos de prueba:', error);
    }
  }
  

  // Genera datos de prueba
  async generateTestDataWithUsers() {
    try {
      // Crear usuarios de prueba
      const users: User[] = [
        {
          uid: this.firebaseSvc.createId(),
          email: 'user1@test.com',
          password: 'password1',
          name: 'Juan Pérez',
          lastName: 'Pérez',
          rut: '12345678-9',
          roles: [UserRole.Service],
          createdAt: new Date().toISOString(),
        },
        {
          uid: this.firebaseSvc.createId(),
          email: 'user2@test.com',
          password: 'password2',
          name: 'María López',
          lastName: 'López',
          rut: '98765432-1',
          roles: [UserRole.Service],
          createdAt: new Date().toISOString(),
        },
        {
          uid: this.firebaseSvc.createId(),
          email: 'user3@test.com',
          password: 'password3',
          name: 'Carlos García',
          lastName: 'García',
          rut: '11223344-5',
          roles: [UserRole.Service],
          createdAt: new Date().toISOString(),
        },
      ];

      for (const user of users) {
        // Crear cuenta en Firebase Authentication
        const authUser = await this.firebaseSvc.signUp({ email: user.email, password: user.password });
        user.uid = authUser.user.uid; // Actualizar el UID generado por Firebase Auth

        // Subir imagen de perfil
        user.profileImageUrl = await this.uploadRandomImage(user.uid, 'profile.jpg', 'profile', true);

        // Guardar el usuario en Firestore
        delete user.password; // No guardar la contraseña en Firestore
        await this.firebaseSvc.setDocument(`users/${user.uid}`, user);
      }

      console.log('Usuarios creados con éxito.');

      // Crear servicios de prueba
      const services: Service[] = [
        {
          id: this.firebaseSvc.createId(),
          name: 'Glamour Nails Studio',
          category: 'Belleza',
          description: 'Ofrecemos tratamientos de belleza para uñas.',
          ownerId: users[0].uid,
          ownerName: users[0].name,
          imageUrl: await this.uploadRandomImage(users[0].uid, 'service-1.jpg', 'service', true),
          createdAt: new Date().toISOString(),
          offers: [
            {
              id: this.firebaseSvc.createId(),
              name: 'Manicure Básico',
              description: 'Cuidado básico para uñas.',
              price: 10000,
              duration: 60,
              imageUrl: await this.uploadRandomImage(users[0].uid, 'offer-1.jpg', 'offer', true),
            },
            {
              id: this.firebaseSvc.createId(),
              name: 'Pedicure Completo',
              description: 'Hidratación y esmaltado.',
              price: 15000,
              duration: 90,
              imageUrl: await this.uploadRandomImage(users[0].uid, 'offer-2.jpg', 'offer', true),
            },
          ],
        },
        {
          id: this.firebaseSvc.createId(),
          name: 'Healthy Life Gym',
          category: 'Fitness',
          description: 'Un gimnasio completo para mantenerte en forma.',
          ownerId: users[1].uid, // Cambiar el usuario propietario según sea necesario
          ownerName: users[1].name,
          imageUrl: await this.uploadRandomImage(users[1].uid, 'service-2.jpg', 'service', true),
          createdAt: new Date().toISOString(),
          offers: [
            {
              id: this.firebaseSvc.createId(),
              name: 'Entrenamiento Personalizado',
              description: 'Sesiones personalizadas con un entrenador.',
              price: 30000,
              duration: 60,
              imageUrl: await this.uploadRandomImage(users[1].uid, 'offer-3.jpg', 'offer', true),
            },
            {
              id: this.firebaseSvc.createId(),
              name: 'Clases Grupales de Yoga',
              description: 'Relájate y mejora tu flexibilidad con yoga.',
              price: 15000,
              duration: 90,
              imageUrl: await this.uploadRandomImage(users[1].uid, 'offer-4.jpg', 'offer', true),
            },
          ],
        },
        {
          id: this.firebaseSvc.createId(),
          name: 'Luxury Spa Retreat',
          category: 'Salud',
          description: 'Un spa de lujo para consentirte.',
          ownerId: users[2].uid,
          ownerName: users[2].name,
          imageUrl: await this.uploadRandomImage(users[2].uid, 'service-3.jpg', 'service', true),
          createdAt: new Date().toISOString(),
          offers: [
            {
              id: this.firebaseSvc.createId(),
              name: 'Masaje con Piedras Calientes',
              description: 'Libera tensiones con este tratamiento relajante.',
              price: 45000,
              duration: 60,
              imageUrl: await this.uploadRandomImage(users[2].uid, 'offer-5.jpg', 'offer', true),
            },
            {
              id: this.firebaseSvc.createId(),
              name: 'Facial Hidratante',
              description: 'Rejuvenece tu piel con una hidratación profunda.',
              price: 30000,
              duration: 45,
              imageUrl: await this.uploadRandomImage(users[2].uid, 'offer-6.jpg', 'offer', true),
            },
          ],
        },
        {
          id: this.firebaseSvc.createId(),
          name: 'Pet Paradise Hotel',
          category: 'Veterinaria',
          description: 'Cuidado premium para tu mascota mientras estás fuera.',
          ownerId: users[0].uid,
          ownerName: users[0].name,
          imageUrl: await this.uploadRandomImage(users[0].uid, 'service-4.jpg', 'service', true),
          createdAt: new Date().toISOString(),
          offers: [
            {
              id: this.firebaseSvc.createId(),
              name: 'Estancia por Día',
              description: 'Cuida de tu mascota mientras trabajas.',
              price: 20000,
              duration: 1440, // Duración en minutos
              imageUrl: await this.uploadRandomImage(users[0].uid, 'offer-7.jpg', 'offer', true),
            },
            {
              id: this.firebaseSvc.createId(),
              name: 'Entrenamiento Canino Básico',
              description: 'Enseña a tu perro comandos básicos.',
              price: 50000,
              duration: 120,
              imageUrl: await this.uploadRandomImage(users[0].uid, 'offer-8.jpg', 'offer', true),
            },
          ],
        },
        {
          id: this.firebaseSvc.createId(),
          name: 'TechFix Express',
          category: 'Tecnología',
          description: 'Reparaciones rápidas y eficientes para tus dispositivos.',
          ownerId: users[1].uid,
          ownerName: users[1].name,
          imageUrl: await this.uploadRandomImage(users[1].uid, 'service-5.jpg', 'service', true),
          createdAt: new Date().toISOString(),
          offers: [
            {
              id: this.firebaseSvc.createId(),
              name: 'Reparación de Pantallas de Móviles',
              description: 'Cambio rápido de pantalla para tu móvil.',
              price: 80000,
              duration: 60,
              imageUrl: await this.uploadRandomImage(users[1].uid, 'offer-9.jpg', 'offer', true),
            },
            {
              id: this.firebaseSvc.createId(),
              name: 'Optimización de Computadoras',
              description: 'Mejora el rendimiento de tu computadora.',
              price: 40000,
              duration: 90,
              imageUrl: await this.uploadRandomImage(users[1].uid, 'offer-10.jpg', 'offer', true),
            },
          ],
        },
        // ... Agregar más servicios de prueba aquí
      ];

      // Guardar los servicios en Firestore
      for (const service of services) {
        await this.firebaseSvc.setDocument(`services/${service.id}`, service);
      }

      

      console.log('Servicios creados con éxito.');
    } catch (error) {
      console.error('Error al generar datos de prueba:', error);
    }
  }

  async generateTestServicesAndOffers(users: User[]) {
    try {
      const services: Service[] = [
        {
          id: this.firebaseSvc.createId(),
          name: 'Glamour Nails Studio',
          category: 'Belleza',
          description: 'Ofrecemos tratamientos de belleza para uñas.',
          ownerId: users[0].uid,
          ownerName: users[0].name,
          imageUrl: await this.uploadRandomImage(users[0].uid, 'service-1.jpg', 'service', true),
          createdAt: new Date().toISOString(),
          offers: [
            {
              id: this.firebaseSvc.createId(),
              name: 'Manicure Básico',
              description: 'Cuidado básico para uñas.',
              price: 10000,
              duration: 60,
              imageUrl: await this.uploadRandomImage(users[0].uid, 'offer-1.jpg', 'offer', true),
            },
            {
              id: this.firebaseSvc.createId(),
              name: 'Pedicure Completo',
              description: 'Hidratación y esmaltado.',
              price: 15000,
              duration: 90,
              imageUrl: await this.uploadRandomImage(users[0].uid, 'offer-2.jpg', 'offer', true),
            },
          ],
        },
        {
          id: this.firebaseSvc.createId(),
          name: 'Healthy Life Gym',
          category: 'Fitness',
          description: 'Un gimnasio completo para mantenerte en forma.',
          ownerId: users[1].uid, // Cambiar el usuario propietario según sea necesario
          ownerName: users[1].name,
          imageUrl: await this.uploadRandomImage(users[1].uid, 'service-2.jpg', 'service', true),
          createdAt: new Date().toISOString(),
          offers: [
            {
              id: this.firebaseSvc.createId(),
              name: 'Entrenamiento Personalizado',
              description: 'Sesiones personalizadas con un entrenador.',
              price: 30000,
              duration: 60,
              imageUrl: await this.uploadRandomImage(users[1].uid, 'offer-3.jpg', 'offer', true),
            },
            {
              id: this.firebaseSvc.createId(),
              name: 'Clases Grupales de Yoga',
              description: 'Relájate y mejora tu flexibilidad con yoga.',
              price: 15000,
              duration: 90,
              imageUrl: await this.uploadRandomImage(users[1].uid, 'offer-4.jpg', 'offer', true),
            },
          ],
        },
        {
          id: this.firebaseSvc.createId(),
          name: 'Luxury Spa Retreat',
          category: 'Salud',
          description: 'Un spa de lujo para consentirte.',
          ownerId: users[2].uid,
          ownerName: users[2].name,
          imageUrl: await this.uploadRandomImage(users[2].uid, 'service-3.jpg', 'service', true),
          createdAt: new Date().toISOString(),
          offers: [
            {
              id: this.firebaseSvc.createId(),
              name: 'Masaje con Piedras Calientes',
              description: 'Libera tensiones con este tratamiento relajante.',
              price: 45000,
              duration: 60,
              imageUrl: await this.uploadRandomImage(users[2].uid, 'offer-5.jpg', 'offer', true),
            },
            {
              id: this.firebaseSvc.createId(),
              name: 'Facial Hidratante',
              description: 'Rejuvenece tu piel con una hidratación profunda.',
              price: 30000,
              duration: 45,
              imageUrl: await this.uploadRandomImage(users[2].uid, 'offer-6.jpg', 'offer', true),
            },
          ],
        },
        {
          id: this.firebaseSvc.createId(),
          name: 'Pet Paradise Hotel',
          category: 'Veterinaria',
          description: 'Cuidado premium para tu mascota mientras estás fuera.',
          ownerId: users[0].uid,
          ownerName: users[0].name,
          imageUrl: await this.uploadRandomImage(users[0].uid, 'service-4.jpg', 'service', true),
          createdAt: new Date().toISOString(),
          offers: [
            {
              id: this.firebaseSvc.createId(),
              name: 'Estancia por Día',
              description: 'Cuida de tu mascota mientras trabajas.',
              price: 20000,
              duration: 1440, // Duración en minutos
              imageUrl: await this.uploadRandomImage(users[0].uid, 'offer-7.jpg', 'offer', true),
            },
            {
              id: this.firebaseSvc.createId(),
              name: 'Entrenamiento Canino Básico',
              description: 'Enseña a tu perro comandos básicos.',
              price: 50000,
              duration: 120,
              imageUrl: await this.uploadRandomImage(users[0].uid, 'offer-8.jpg', 'offer', true),
            },
          ],
        },
        {
          id: this.firebaseSvc.createId(),
          name: 'TechFix Express',
          category: 'Tecnología',
          description: 'Reparaciones rápidas y eficientes para tus dispositivos.',
          ownerId: users[1].uid,
          ownerName: users[1].name,
          imageUrl: await this.uploadRandomImage(users[1].uid, 'service-5.jpg', 'service', true),
          createdAt: new Date().toISOString(),
          offers: [
            {
              id: this.firebaseSvc.createId(),
              name: 'Reparación de Pantallas de Móviles',
              description: 'Cambio rápido de pantalla para tu móvil.',
              price: 80000,
              duration: 60,
              imageUrl: await this.uploadRandomImage(users[1].uid, 'offer-9.jpg', 'offer', true),
            },
            {
              id: this.firebaseSvc.createId(),
              name: 'Optimización de Computadoras',
              description: 'Mejora el rendimiento de tu computadora.',
              price: 40000,
              duration: 90,
              imageUrl: await this.uploadRandomImage(users[1].uid, 'offer-10.jpg', 'offer', true),
            },
          ],
        },
        // Agregar más servicios aquí
      ];
  
      // Guardar los servicios en Firestore
      for (const service of services) {
        await this.firebaseSvc.setDocument(`services/${service.id}`, service);
      }
  
      console.log('Servicios y ofertas creados con éxito.');
    } catch (error) {
      console.error('Error al generar servicios y ofertas:', error);
    }
  }
  
}
