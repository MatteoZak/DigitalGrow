import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlantDetailedTipsPage } from './plant-detailed-tips.page';

describe('PlantDetailedTipsPage', () => {
  let component: PlantDetailedTipsPage;
  let fixture: ComponentFixture<PlantDetailedTipsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantDetailedTipsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
