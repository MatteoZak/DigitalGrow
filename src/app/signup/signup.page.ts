// signup.page.ts
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, logoGoogle, logoApple } from 'ionicons/icons';

export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password?.pristine || confirmPassword?.pristine) {
    return null;
  }
  
  return password && confirmPassword && password.value !== confirmPassword.value ? { passwordsMismatch: true } : null;
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [ IonicModule, CommonModule, ReactiveFormsModule ]
})
export class SignupPage implements OnInit {

  signupForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    addIcons({ personOutline, mailOutline, lockClosedOutline, logoGoogle, logoApple });
  }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue]
    }, { validators: passwordsMatchValidator });
  }

  signup() {
    if (this.signupForm.invalid) {
      console.log('Form non valido!');
      return;
    }

    console.log('Dati del form di registrazione:', this.signupForm.value);

    this.router.navigate(['/tabs/tab1']);
  }

  goToSignin() {
    this.router.navigate(['/login']);
  }
}