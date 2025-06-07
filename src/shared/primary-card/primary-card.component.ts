import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  imports: [
    IonicModule,
    CommonModule
  ],
  standalone: true,
  selector: 'app-primary-card',
  templateUrl: './primary-card.component.html',
  styleUrls: ['./primary-card.component.scss'],
})
export class PrimaryCardComponent  implements OnInit {
  @Input() description?: string;
  @Input() value?:  string | number;
  @Input() unitMeasure?: string;
  @Input() icon?: string;
  @Input() color?: string;


  constructor() { }

  ngOnInit() {}

}
