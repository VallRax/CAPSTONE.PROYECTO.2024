import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserRole } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]), // Campo apellido
    rut: new FormControl('', [Validators.required, Validators.pattern(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]{1}$/)]), // Validación de RUT
    role: new FormControl('client', Validators.required), // Rol predeterminado como Cliente
    contactNumber: new FormControl('', [Validators.required]),
    location: new FormGroup({
      region: new FormControl('', [Validators.required]),
      comuna: new FormControl('', [Validators.required]), // Nuevo campo comuna
      address: new FormControl('', [Validators.required]),
      addressNumber: new FormControl(''),
      department: new FormControl(''),
    }),
  });
  
  
  

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      try {
        const { email, password, name, lastName, rut, role, contactNumber, location } = this.form.value;

        // Crear usuario en Firebase Authentication
        const userCredential = await this.firebaseSvc.signUp({ email, password });

        const uid = userCredential.user.uid;

        // Crear objeto del usuario basado en el modelo
        const newUser: User = {
        uid,
        email,
        name,
        lastName,
        rut,
        roles: [role as UserRole], // Convertir a un array con un único rol
        contactNumber,
        location,
        profileImageUrl: '', // Imagen predeterminada
        createdAt: new Date().toISOString(),
        favorites: [],
        bookings: [],
        servicesOffered: [],
        ratingAverage: 0,
        reviews: [],
        };

        // Guardar usuario en Firestore
        await this.firebaseSvc.setDocument(`users_test/${uid}`, newUser);

        // Guardar usuario en localStorage
        this.utilsSvc.saveInLocalStorage('user', newUser);

        this.utilsSvc.presentToast({
          message: 'Registro exitoso. Bienvenido!',
          color: 'success',
        });

        this.utilsSvc.routerLink('/home');
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        this.utilsSvc.presentToast({
          message: 'Hubo un error al registrarte. Intenta nuevamente.',
          color: 'danger',
        });
      } finally {
        loading.dismiss();
      }
    }
  }

}
