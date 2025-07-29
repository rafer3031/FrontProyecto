import { Component, input, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'login-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './login-card.html',
  styleUrl: './login-card.scss',
})
export class LoginCard {
  isLoginMode = input.required<boolean>();
  toggleMode = output<void>();
  changeMode() {
    this.toggleMode.emit();
  }
}
