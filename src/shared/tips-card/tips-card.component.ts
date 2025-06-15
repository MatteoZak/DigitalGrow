import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class TipsCardComponent {
  @Input() title: string = '';
  @Input() tips: string = '';
  @Input() isLoading: boolean = false;

  @Output() infoClicked = new EventEmitter<void>();

  constructor() { }

  goToDetailed() {
    this.infoClicked.emit();
  }

}
