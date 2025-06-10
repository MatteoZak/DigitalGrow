import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Plant } from 'src/app/tab4/tab4.page';


@Component({
  selector: 'app-generic-card-plants',
  templateUrl: './generic-card-plants.component.html',
  styleUrls: ['./generic-card-plants.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
],
  standalone: true
})
export class GenericCardPlantsComponent  implements OnInit {
  @Input() plant?: Plant;

  constructor() { }

  ngOnInit() {}

  toggleFavorite() {
    if (this.plant) {
      this.plant.isFavorite = !this.plant.isFavorite;
    }
  }

}
