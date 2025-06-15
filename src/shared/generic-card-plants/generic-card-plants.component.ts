import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
],
  standalone: true
})
export class GenericCardPlantsComponent  implements OnInit {
  @Input() plant?: Plant;
  @Output() edit = new EventEmitter<Plant>();
  @Output() delete = new EventEmitter<Plant>();

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {}

  toggleFavorite() {
    if (this.plant) {
      this.plant.isFavorite = !this.plant.isFavorite;
    }
  }

  async presentPopover(e: Event) {
    const popover = await this.popoverCtrl.create({
      component: ActionsPopoverComponent,
      event: e,
      translucent: true
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data) {
      if (data.action === 'modifica') {
        this.edit.emit(this.plant);
      } else if (data.action === 'elimina') {
        this.delete.emit(this.plant);
      }
    }
  }

}
