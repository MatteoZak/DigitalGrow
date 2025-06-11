import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons } from '@ionic/angular/standalone';
import { GenericCardPlantsComponent } from "../../shared/generic-card-plants/generic-card-plants.component";
import { SensorData } from 'src/services/gemini-service/gemini.service';

export interface Plant {
  name: string;
  image: string;
  sensorData: SensorData;
  isFavorite?: boolean;
}

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  imports: [IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, GenericCardPlantsComponent],
})
export class Tab4Page {

  plants: Plant[] = [
    {
      name: 'Plant 1',
      image: '../../assets/images/pianta.png',
      sensorData: {
        temperature: 18,
        humidity: 35,
        lightIntensity: 300,
        tankLevel: 70,
      },
      isFavorite: false,
    },
    {
      name: 'Plant 2',
      image: '../../assets/images/image_plant.png',
      sensorData: {
        temperature: 25,
        humidity: 80,
        lightIntensity: 500,
        tankLevel: 90,
      },
      isFavorite: false,
    },
    {
      name: 'Plant 3',
      image: '../../assets/images/plant_3.png',
      sensorData: {
        temperature: 28,
        humidity: 64,
        lightIntensity: 800,
        tankLevel: 10,
      },
      isFavorite: false,
    }
  ]


  constructor() { }
}
