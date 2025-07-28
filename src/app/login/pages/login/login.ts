import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'login',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatRadioModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export default class Login {
  isLoginMode = signal(true);

  constructor() {}
  changeModeLoginForm() {
    this.isLoginMode.set(true);
  }
  changeModeRegisterForm() {
    this.isLoginMode.set(false);
  }
}
