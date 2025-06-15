import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from 'src/services/gemini-service/gemini.service';
import { IonContent, IonToolbar, IonTitle, IonCard, IonCardContent, IonFab, IonFabButton, IonBackButton, IonButtons, IonHeader, IonSkeletonText } from '@ionic/angular/standalone';
import { MarkdownModule } from 'ngx-markdown';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plant-detailed-tips',
  templateUrl: './plant-detailed-tips.page.html',
  styleUrls: ['./plant-detailed-tips.page.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonHeader, 
    CommonModule,
    FormsModule,
    MarkdownModule,
    IonContent,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonFab,
    IonFabButton,
    IonBackButton,
    IonButtons
  ]
})
export class PlantDetailedTipsPage implements OnInit {

  @ViewChild(IonContent) private content!: IonContent;
  
  private geminiService: GeminiService = inject(GeminiService);
  private route = inject(ActivatedRoute);
  private scrollSubscription!: Subscription;

  plantType: string = '';
  careSheetHeader: string = '';
  careSheetBody: string = '';
  isLoadingSheet: boolean = false;
  error: string | null = null;
  showScrollToTopButton: boolean = false;

  constructor() {}

  ngOnInit() {
    const typeFromRoute = this.route.snapshot.paramMap.get('plantType');
    
    if (typeFromRoute) {
      this.plantType = typeFromRoute;
      this.fetchDetailedCareSheet();
    } else {
      console.error('Nessun plantType trovato nella rotta!');
      this.error = 'Impossibile caricare i dati della pianta.';
    }
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
