import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

 
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    role: new FormControl('client', Validators.required) // Rol predeterminado como cliente
  })  

  
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject( UtilsService)
  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
  
      this.firebaseSvc.signUp(this.form.value as User).then(async res => {
        await this.firebaseSvc.updateUser(this.form.value.name);
  
        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);
  
        this.setUserInfo(uid);
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: `Correo no válido, inténtelo nuevamente`,
          duration: 2500,
          color: 'warning',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    }
  }  

  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
  
      const path = `users_test/${uid}`;
  
      // Asegúrate de inicializar el campo favorites
      const userData = {
        ...this.form.value,
        favorites: [] // Inicializa favorites como un arreglo vacío
      };
      delete userData.password; // No guardes la contraseña en Firestore
  
      this.firebaseSvc.setDocument(path, userData).then(async () => {
        this.utilsSvc.saveInLocalStorage('user', userData);
        this.utilsSvc.routerLink('/auth');
        this.form.reset();
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    }
  }
  
}
