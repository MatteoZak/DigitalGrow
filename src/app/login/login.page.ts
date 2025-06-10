import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, eyeOutline, logoGoogle, logoApple } from 'ionicons/icons';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
    ) {
      addIcons({
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      logoGoogle,
      logoApple
    });
    }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      console.log('Form non valido');
      return;
    }

    console.log('Dati del form:', this.loginForm.value);

    this.router.navigate(['/tabs/tab1']);
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}