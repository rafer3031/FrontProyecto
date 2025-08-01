import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { LeftContent } from '../../components/left-content/left-content';
import { RightContent } from '../../components/right-content/right-content';
import { SupabaseService } from '../../services/supabase.service';
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
    LeftContent,
    RightContent,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export default class Login {

}
