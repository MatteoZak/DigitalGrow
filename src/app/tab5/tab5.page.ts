import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, ReactiveFormsModule, Validators } from '@angular/forms';

import { mailOutline, lockClosedOutline, eyeOutline, keyOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  if (newPassword?.pristine || confirmPassword?.pristine) {
    return null;
  }
  return newPassword && confirmPassword && newPassword.value !== confirmPassword.value ? { passwordsMismatch: true } : null;
};

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ],
})
export class Tab5Page implements OnInit {

  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  changePasswordForm!: FormGroup;

  notificationPreferences = [
    { label: 'Criticità Luce', value: true },
    { label: 'Criticità Temperatura', value: true },
    { label: 'Criticità Umidità', value: true },
    { label: 'Criticità Serbatoio', value: true }
  ]

  constructor() {
    addIcons({
          mailOutline,
          lockClosedOutline,
          eyeOutline,
          keyOutline,
        });
  }

  ngOnInit() {
    this.changePasswordForm = this._formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordsMatchValidator });
  }

  savePassword() {
    if (this.changePasswordForm.invalid) {
      console.log("Form non valido, controlla gli errori.");
      // Qui potresti mostrare un toast di errore
      return;
    }

    // Qui andrà la logica per chiamare il tuo backend e cambiare la password
    console.log("Nuova password da salvare:", this.changePasswordForm.value);
    // Mostra un toast di successo e resetta il form
    this.changePasswordForm.reset();
  }

  goToLogin() {
    this._router.navigate(['/login']);
  }
}
