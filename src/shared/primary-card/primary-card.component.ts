import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  imports: [
    IonicModule,
  ],
  standalone: true,
  selector: 'app-primary-card',
  templateUrl: './primary-card.component.html',
  styleUrls: ['./primary-card.component.scss'],
})
export class PrimaryCardComponent  implements OnInit {
  @Input() description?: string;
  @Input() value?: string;
  @Input() icon?: string;


  constructor() { }

  ngOnInit() {}

}
