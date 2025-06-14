import { Component } from '@angular/core';
import { PopoverController, IonicModule } from '@ionic/angular';

// Dobbiamo creare un piccolo componente per il contenuto del popover
@Component({
  standalone: true,
  imports: [IonicModule],
  template: `
    <ion-list>

      <ion-item [button]="true" [detail]="false" (click)="onAction('modifica')">
        <ion-label>Modifica</ion-label>
      </ion-item>

      <ion-item [button]="true" [detail]="false" (click)="onAction('elimina')" lines="none">
        <ion-label color="danger">Elimina</ion-label>
      </ion-item>
      
    </ion-list>
  `
})
export class ActionsPopoverComponent {
  constructor(private popoverCtrl: PopoverController) {}

  onAction(action: 'modifica' | 'elimina') {
    // Chiude il popover e restituisce l'azione scelta
    this.popoverCtrl.dismiss({ action });
  }
}