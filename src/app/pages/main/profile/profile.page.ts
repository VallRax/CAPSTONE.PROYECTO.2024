import { Component, inject, Input, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { library, playCircle, radio, search } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  @Input() backButton!: string; 

  constructor(private router: Router) { }

  Profile() {
    this.router.navigate(['/profile']);  // Navegar a la página de perfil
  }

  signOut() {
    this.firebaseSvc.signOut();
  }

  ngOnInit() {

  }

}
