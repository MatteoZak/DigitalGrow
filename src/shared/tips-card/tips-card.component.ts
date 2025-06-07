import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  imports: [
    IonicModule,
    MarkdownModule,
    CommonModule
  ],
  selector: 'app-tips-card',
  templateUrl: './tips-card.component.html',
  styleUrls: ['./tips-card.component.scss'],
})
export class TipsCardComponent  implements OnInit {
  @Input() title: string = '';
  @Input() tips: string = '';
  @Input() isLoading: boolean = false;

  private _router = inject(Router);

  constructor() { }

  ngOnInit() {}

  goToDetailed() {
    this._router.navigate(['/plant-detailed-tips']);
  }

}
