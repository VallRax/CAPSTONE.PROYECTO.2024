import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UtilsService } from 'src/app/core/services/utils.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class loginPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)
  ngOnInit() {
  }

 async submit(){
    localStorage.clear()
    if (this.form.valid){

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signIn(this.form.value as User).then(res => {

       

        this.getUserInfo(res.user.uid);

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: `Correo o usuario incorrecto, intentelo de nuevamente o reestablezca su contraseña.`,
          duration: 2500,
          color:'warning',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      })
    }
  }


  async getUserInfo(uid: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    let path = `users/${uid}`;
  
    try {
      const user = await this.firebaseSvc.getDocument(path) as User;
      if (user) {
        localStorage.clear();
        this.utilsSvc.saveInLocalStorage('user', user);
  
        this.utilsSvc.routerLink('home');
        setTimeout(() => {
          window.location.reload(); // Forzar recarga
        }, 500);
        this.form.reset();
  
        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida ${user.name}`,
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'person-circle-outline'
        });
      } else {
        console.error('El usuario no existe en Firestore');
        this.utilsSvc.presentToast({
          message: 'El usuario no se encuentra registrado en el sistema.',
          duration: 2500,
          color: 'warning',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
  
      this.utilsSvc.presentToast({
        message: 'Hubo un error al obtener la información del usuario.',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }
  
}
