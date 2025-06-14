import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Plant } from 'src/app/tab4/tab4.page';
import { ActionsPopoverComponent } from './action-popover.component';


@Component({
  selector: 'app-generic-card-plants',
  templateUrl: './generic-card-plants.component.html',
  styleUrls: ['./generic-card-plants.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    ActionsPopoverComponent, 
],
  standalone: true
})
export class GenericCardPlantsComponent  implements OnInit {
  @Input() plant?: Plant;

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {}

  toggleFavorite() {
    if (this.plant) {
      this.plant.isFavorite = !this.plant.isFavorite;
    }
  }

  async presentPopover(e: Event) {
    const popover = await this.popoverCtrl.create({
      component: ActionsPopoverComponent, // Il componente da mostrare
      event: e, // L'evento click per il posizionamento
      translucent: true
    });

    await popover.present();

    // Aspetta che il popover venga chiuso per ricevere i dati
    const { data } = await popover.onDidDismiss();
    if (data) {
      console.log('Azione scelta:', data.action);
      if (data.action === 'modifica') {
        // Logica per modificare
      } else if (data.action === 'elimina') {
        // Logica per eliminare
      }
    }
  }

}
