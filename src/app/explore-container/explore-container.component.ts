import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MarkdownModule } from 'ngx-markdown';
import { GeminiService, SensorData } from 'src/services/gemini-service/gemini.service';
import { GeminiChatComponent } from 'src/shared/gemini-chat/gemini-chat.component';
import { PrimaryCardComponent } from 'src/shared/primary-card/primary-card.component';
import { TipsCardComponent } from 'src/shared/tips-card/tips-card.component';

@Component({
  imports: [
    IonicModule,
    PrimaryCardComponent,
    GeminiChatComponent,
    CommonModule,
    MarkdownModule,
    TipsCardComponent,
  ],
  standalone: true,
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {

  private geminiService = inject(GeminiService);
  dashboardTips: string = '';
  isLoadingTips: boolean = false;
  
  // Dati finti per l'esempio, tu li prenderai dai sensori
  currentSensorData: SensorData = { temperature: 28, humidity: 35, tankLevel: 80, lightIntensity: 70 };

  plantType: string = 'Aglaonema'; // L'utente inserirà questo valore in un input
  careSheet: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  ngOnInit() {
    this.fetchDashboardTips();
  }

  fetchDashboardTips() {
    this.isLoadingTips = true;
    this.geminiService.getDashboardTips(this.plantType, this.currentSensorData).subscribe(tips => {
      this.dashboardTips = tips;
      this.isLoadingTips = false;
    });
  }

  generateTips() {
    this.isLoading = true; // Spostato qui per una UI più reattiva
    this.error = null;

    this.geminiService.getDetailedCareSheet(this.plantType).subscribe({
      next: (responseText: string) => { // 'responseText' è già la stringa finale
        
        // La riga da modificare è questa:
        this.careSheet = responseText; // Assegna direttamente la risposta

        this.isLoading = false;
        console.log('Scheda di cura generata o caricata dalla cache!', this.careSheet);
      },
      error: (err) => {
        console.error('Errore durante la generazione della scheda di cura:', err);
        this.error = 'Si è verificato un errore durante la generazione della scheda.';
        this.isLoading = false;
      }
    });
  }
  
}
