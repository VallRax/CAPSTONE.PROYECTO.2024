import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/core/services/firebase.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
  constructor(private router: Router, private firebaseSvc: FirebaseService) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
    // Cierra el menú después de navegar
    document.querySelector('ion-menu')?.close();
  }

  signOut() {
    this.firebaseSvc.signOut();
    this.router.navigate(['/auth']);
    document.querySelector('ion-menu')?.close();
  }
}
