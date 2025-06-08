import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MarkdownModule } from 'ngx-markdown';
import { GeminiService, SensorData } from 'src/services/gemini-service/gemini.service';
import { PrimaryCardComponent } from 'src/shared/primary-card/primary-card.component';
import { TipsCardComponent } from 'src/shared/tips-card/tips-card.component';

@Component({
  imports: [
    IonicModule,
    PrimaryCardComponent,
    CommonModule,
    MarkdownModule,
    TipsCardComponent,
    FormsModule,
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
  isIrrigazioneAutomatica: boolean = false;
  irrigationThreshold: number = 50;
  
  currentSensorData: SensorData = { temperature: 28, humidity: 35, tankLevel: 80, lightIntensity: 70 };

  plantType: string = 'Aglaonema';
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
    this.isLoading = true;
    this.error = null;

    this.geminiService.getDetailedCareSheet(this.plantType).subscribe({
      next: (responseText: string) => {
        
        this.careSheet = responseText;

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

  pinFormatter(value: number) {
    return `${value}%`;
  }
  
}
