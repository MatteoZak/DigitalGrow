import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MarkdownModule } from 'ngx-markdown';
import { GeminiService, SensorData } from 'src/services/gemini-service/gemini.service';
import { PrimaryCardComponent } from 'src/shared/primary-card/primary-card.component';
import { TipsCardComponent } from 'src/shared/tips-card/tips-card.component';
import { Plant } from '../tab4/tab4.page';
import Swiper from 'swiper';
import { Router } from '@angular/router';

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
export class ExploreContainerComponent {
  @ViewChild('swiperContainer') swiperRef!: ElementRef;

  private geminiService = inject(GeminiService);
  private cdr = inject(ChangeDetectorRef);
  private _router = inject(Router);
  dashboardTips: string = '';
  isLoadingTips: boolean = false;
  isIrrigazioneAutomatica: boolean = false;
  irrigationThreshold: number = 50;
  
  currentSensorData: SensorData = { temperature: 22, humidity: 80, tankLevel: 10, lightIntensity: 7000 };
  
  userPlants: Plant[] = [
    {
      name: 'Plant 1',
      plantType: 'Aglaonema',
      image: '../../assets/images/pianta.png',
      sensorData: {
        temperature: 18,
        humidity: 35,
        lightIntensity: 300,
        tankLevel: 70,
      },
      isFavorite: false,
      isIrrigazioneAutomatica: true,
      irrigationThreshold: 40,
    },
    {
      name: 'Plant 2',
      plantType: 'Monstera Deliciosa',
      image: '../../assets/images/image_plant.png',
      sensorData: {
        temperature: 25,
        humidity: 80,
        lightIntensity: 500,
        tankLevel: 90,
      },
      isFavorite: false,
      isIrrigazioneAutomatica: false,
      irrigationThreshold: 50,
    },
    {
      name: 'Plant 3',
      plantType: 'Sansevieria',
      image: '../../assets/images/plant_3.png',
      sensorData: {
        temperature: 28,
        humidity: 64,
        lightIntensity: 800,
        tankLevel: 10,
      },
      isFavorite: false,
      isIrrigazioneAutomatica: true,
      irrigationThreshold: 30,
    }
  ]

  activePlant!: Plant;
  careSheet: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    if (this.userPlants.length > 0) {
      this.activePlant = this.userPlants[0];
    }
  }
  
  async ngAfterViewInit() {
    const swiperEl = this.swiperRef.nativeElement;

    await swiperEl.initialize();

    swiperEl.swiper.on('slideChange', (swiper: Swiper) => {
      const activeIndex = swiper.realIndex;
      
      this.activePlant = this.userPlants[activeIndex];
      
      this.fetchDashboardTips(this.activePlant);
      
      this.cdr.detectChanges();
    });
  }

  fetchDashboardTips(plant: Plant) {
    this.isLoading = true;
    this.dashboardTips = '';
    this.geminiService.getDashboardTips(plant.plantType, plant.sensorData).subscribe(tips => {
      this.dashboardTips = tips;
      this.isLoading = false;
    });
  }

  generateTips() {
    this.isLoading = true;
    this.error = null;

    this.geminiService.getDetailedCareSheet(this.activePlant.plantType).subscribe({
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

  goToDetailedTips() {
    this._router.navigate(['/plant-detailed-tips', this.activePlant.plantType]);
  }
  
}
