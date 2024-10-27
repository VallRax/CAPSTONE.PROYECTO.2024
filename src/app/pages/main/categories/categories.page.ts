import { Component, Input, inject, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  @Input() backButton!: string; 
  navCtrl = inject(NavController);  // Inyecta NavController

  constructor() { }

  ngOnInit() {
  }

}
