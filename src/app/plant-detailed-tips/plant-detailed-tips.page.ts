import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from 'src/services/gemini-service/gemini.service';
import { IonContent, IonToolbar, IonTitle, IonCard, IonCardContent, IonSpinner, IonFab, IonFabButton, IonIcon, IonBackButton, IonButtons, IonHeader } from '@ionic/angular/standalone';
import { MarkdownModule } from 'ngx-markdown';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-plant-detailed-tips',
  templateUrl: './plant-detailed-tips.page.html',
  styleUrls: ['./plant-detailed-tips.page.scss'],
  standalone: true,
  imports: [IonHeader, 
    CommonModule,
    FormsModule,
    MarkdownModule,
    IonContent,
    IonToolbar,
    IonTitle,
    IonCard,
    IonSpinner,
    IonCardContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonBackButton,
    IonButtons
  ]
})
export class PlantDetailedTipsPage implements OnInit {

  @ViewChild(IonContent) private content!: IonContent;
  
  private geminiService: GeminiService = inject(GeminiService);
  private scrollSubscription!: Subscription;

  careSheetHeader: string = '';
  careSheetBody: string = '';
  isLoadingSheet: boolean = false;
  error: string | null = null;
  plantType: string = 'Aglaonema';
  showScrollToTopButton: boolean = false;

  constructor() {}

  ngOnInit() {
    this.fetchDetailedCareSheet();
  }

  ionViewDidEnter() {
    this.scrollSubscription = this.content.ionScroll.subscribe(event => {
      if (event.detail.scrollTop > 400) {
        this.showScrollToTopButton = true;
      } else {
        this.showScrollToTopButton = false;
      }
    });
  }

  ionViewWillLeave() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  scrollToTop() {
    this.content.scrollToTop(500);
  }

  fetchDetailedCareSheet() {
  this.isLoadingSheet = true;
  this.careSheetHeader = '';
  this.careSheetBody = '';
  
  this.geminiService.getDetailedCareSheet(this.plantType).subscribe({
    next: (fullResponse: string) => {
      const separator = '**';
      
      const separatorIndex = fullResponse.indexOf(separator);

      if (separatorIndex !== -1) {
        this.careSheetHeader = fullResponse.substring(0, separatorIndex).trim();

        this.careSheetBody = fullResponse.substring(separatorIndex).trim();
      } else {
        this.careSheetHeader = '';
        this.careSheetBody = fullResponse;
      }

      this.isLoadingSheet = false;
    },
    error: (err) => { 
      this.isLoadingSheet = false;
      this.error = 'Si è verificato un errore.';
    }
  });
  }

}
