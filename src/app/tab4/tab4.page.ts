import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, AlertController, ModalController } from '@ionic/angular/standalone';
import { GenericCardPlantsComponent } from "../../shared/generic-card-plants/generic-card-plants.component";
import { SensorData } from 'src/services/gemini-service/gemini.service';
import { EditPlantModalComponent } from '../../shared/edit-plant-modal/edit-plant-modal.component';


export interface Plant {
  name: string;
  plantType: string;
  image: string;
  sensorData: SensorData;
  isFavorite?: boolean;
  isIrrigazioneAutomatica: boolean;
  irrigationThreshold: number;
}

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  imports: [IonHeader, IonToolbar, IonContent, GenericCardPlantsComponent],
})
export class Tab4Page {

  plants: Plant[] = [
    {
      name: 'Plant 1',
      plantType: 'Aglaonema',
      image: '../../assets/images/pianta.png',
      sensorData: {
        temperature: 18,
        humidity: 35,
        lightIntensity: 300,
        tankLevel: 70,
      },
      isFavorite: false,
      isIrrigazioneAutomatica: true,
      irrigationThreshold: 40,
    },
    {
      name: 'Plant 2',
      plantType: 'Monstera Deliciosa',
      image: '../../assets/images/image_plant.png',
      sensorData: {
        temperature: 25,
        humidity: 80,
        lightIntensity: 500,
        tankLevel: 90,
      },
      isFavorite: false,
      isIrrigazioneAutomatica: false,
      irrigationThreshold: 50,
    },
    {
      name: 'Plant 3',
      plantType: 'Sansevieria',
      image: '../../assets/images/plant_3.png',
      sensorData: {
        temperature: 28,
        humidity: 64,
        lightIntensity: 800,
        tankLevel: 10,
      },
      isFavorite: false,
      isIrrigazioneAutomatica: true,
      irrigationThreshold: 30,
    }
  ]

  constructor(private modalCtrl: ModalController, 
    private alertCtrl: AlertController) { }

  async openEditModal(plantToEdit: Plant) {
    const modal = await this.modalCtrl.create({
      component: EditPlantModalComponent,
      componentProps: { plant: plantToEdit }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      const index = this.plants.findIndex(p => p.name === plantToEdit.name);
      if (index > -1) {
        this.plants[index] = data;
      }
    }
  }

  // NUOVO metodo per la conferma dell'eliminazione
  async confirmDelete(plantToDelete: Plant) {
    const alert = await this.alertCtrl.create({
      header: 'Sei sicuro?',
      message: `Vuoi davvero eliminare la pianta "${plantToDelete.name}"? L'azione è irreversibile.`,
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
        },
        {
          text: 'Elimina',
          role: 'confirm',
          cssClass: 'alert-button-danger', // Per renderlo rosso
          handler: () => {
            console.log(`Eliminazione della pianta ${plantToDelete.name}`);
            // Qui metterai la logica per rimuovere la pianta dall'array e dal backend
            this.plants = this.plants.filter(p => p.name !== plantToDelete.name);
          },
        },
      ],
    });

    await alert.present();
  }
}
