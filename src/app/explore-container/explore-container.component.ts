import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PrimaryCardComponent } from 'src/shared/primary-card/primary-card.component';

@Component({
  imports: [
    IonicModule,
    PrimaryCardComponent,
  ],
  standalone: true,
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent {
  
}
