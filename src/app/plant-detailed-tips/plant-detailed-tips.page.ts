import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from 'src/services/gemini-service/gemini.service';
import { IonicModule } from '@ionic/angular';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-plant-detailed-tips',
  templateUrl: './plant-detailed-tips.page.html',
  styleUrls: ['./plant-detailed-tips.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MarkdownModule,
  ]
})
export class PlantDetailedTipsPage implements OnInit {

  private geminiService: GeminiService = inject(GeminiService);

  careSheetHeader: string = '';
  careSheetBody: string = '';
  isLoadingSheet: boolean = false;
  error: string | null = null;
  plantType: string = 'Aglaonema'; // Questo arriverà dalla pagina precedente

  constructor() {}

  ngOnInit() {
    this.fetchDetailedCareSheet();
  }

  fetchDetailedCareSheet() {
  this.isLoadingSheet = true;
  this.careSheetHeader = ''; // Resettiamo le variabili
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
