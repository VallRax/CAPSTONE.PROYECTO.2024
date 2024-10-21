import { Component, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  @Input() title: string = '';
  @Input() showBackButton: boolean = true;

  constructor(private navCtrl: NavController) {}

  goBack() {
    this.navCtrl.back();
  }
  
}
