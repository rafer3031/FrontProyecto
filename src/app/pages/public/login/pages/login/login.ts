import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { RightContent } from '../../components/right-content/right-content';
import { LoginCard } from '../../components/login-card/login-card';
import { RegisterCard } from '../../components/register-card/register-card';
import { DataAccessService } from '../../../../../shared/services/data.access.service';
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
    RightContent,
    LoginCard,
    RegisterCard,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export default class Login {
  dataAccessService = inject(DataAccessService);

  isLoginMode = signal(true);

  changeMode() {
    this.isLoginMode.set(false);
  }
}
