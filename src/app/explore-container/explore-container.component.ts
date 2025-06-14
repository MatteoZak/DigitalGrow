import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MarkdownModule } from 'ngx-markdown';
import { GeminiService, SensorData } from 'src/services/gemini-service/gemini.service';
import { PrimaryCardComponent } from 'src/shared/primary-card/primary-card.component';
import { TipsCardComponent } from 'src/shared/tips-card/tips-card.component';
import { Plant } from '../tab4/tab4.page';

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
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExploreContainerComponent implements OnInit {

  private geminiService = inject(GeminiService);
  dashboardTips: string = '';
  isLoadingTips: boolean = false;
  isIrrigazioneAutomatica: boolean = false;
  irrigationThreshold: number = 50;
  
  currentSensorData: SensorData = { temperature: 22, humidity: 80, tankLevel: 10, lightIntensity: 7000 };
  
  userPlants: Plant[] = [
    {
      name: 'Plant 1',
      image: '../../assets/images/pianta.png',
      sensorData: {
        temperature: 18,
        humidity: 35,
        lightIntensity: 300,
        tankLevel: 70,
      },
      isFavorite: false,
    },
    {
      name: 'Plant 2',
      image: '../../assets/images/image_plant.png',
      sensorData: {
        temperature: 25,
        humidity: 80,
        lightIntensity: 500,
        tankLevel: 90,
      },
      isFavorite: false,
    },
    {
      name: 'Plant 3',
      image: '../../assets/images/plant_3.png',
      sensorData: {
        temperature: 28,
        humidity: 64,
        lightIntensity: 800,
        tankLevel: 10,
      },
      isFavorite: false,
    }
  ]

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
