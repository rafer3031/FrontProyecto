import { Component, signal, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SupabaseService } from '../../services/supabase.service';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../dialog/dialog';

@Component({
  selector: 'login-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-card.html',
  styleUrl: './login-card.scss',
})
export class LoginCard {
  readonly dialog = inject(MatDialog);
  signInForm!: FormGroup;
  message = signal('');
  isError = signal(false);
  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {}
  loading = false;
  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      email: '',
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(Dialog, {
      data: {
        message: this.message(),
        isError: this.isError(),
      },

    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.message.set(result);
      }
      console.log(this.message());
    });
  }

  async onSubmit(): Promise<void> {
    try {
      this.loading = true;
      const email = this.signInForm.value.email as string;
      const { error } = await this.supabase.signIn(email);

      if (error) throw error;

      this.isError.set(false);
      this.message.set(
        'Revise su correo para continuar con el inicio de sesión'
      );
      this.openDialog();
    } catch (error) {
      if (error instanceof Error) {
        this.isError.set(true);
        this.message.set(error.message);
        this.openDialog();
      }
    } finally {
      this.signInForm.reset();
      this.loading = false;
    }
  }
}
