import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalController, IonicModule } from '@ionic/angular';
import { Plant } from 'src/app/tab4/tab4.page';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { leafOutline, shapesOutline } from 'ionicons/icons';

@Component({
  selector: 'app-edit-plant-modal',
  templateUrl: './edit-plant-modal.component.html',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class EditPlantModalComponent implements OnInit {
  @Input() plant!: Plant;

  editForm!: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder
  ) {
    addIcons({ leafOutline, shapesOutline });
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      name: [this.plant.name, Validators.required],
      plantType: [this.plant.plantType, Validators.required],
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    const updatedPlantData = { ...this.plant, ...this.editForm.value };
    return this.modalCtrl.dismiss(updatedPlantData, 'confirm');
  }
}