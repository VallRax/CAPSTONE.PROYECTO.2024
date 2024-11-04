import { Component, inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router'; // Asegúrate de importar Router

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent {
  firebaseSvc = inject(FirebaseService);

  constructor(private navCtrl: NavController, private router: Router) {} // Inyectar Router

  Profile() {
    this.router.navigate(['/profile']);  // Navegar a la página de perfil
  }

  home(){
    this.router.navigate(['home']);
  }

  signOut() {
    this.firebaseSvc.signOut();
  }

}
