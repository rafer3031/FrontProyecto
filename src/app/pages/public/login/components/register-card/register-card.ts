import { Component, signal, inject, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { Dialog } from '../dialog/dialog';
import { AuthService } from '../../../../../shared/auth/auth.service';
import { DialogError } from '../../../../../shared/components/dialog-error/dialog-error';

interface SignUpForm {
  email: FormControl<null | string>;
  password: FormControl<null | string>;
}

@Component({
  selector: 'register-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register-card.html',
  styleUrl: './register-card.scss',
})
export class RegisterCard {
  changeValue = output();
  hide = signal(true);
  userRole = signal<string | null>(null);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  private _formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  authService = inject(AuthService);

  form = this._formBuilder.group<SignUpForm>({
    email: this._formBuilder.control(null, [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  async submit() {
    if (this.form.invalid) return;

    try {
      const authResponse = await this.authService.signUp({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });

      if (authResponse.error) {
        throw authResponse.error;
      }

      this.showSuccessDialog(
        'Por favor revisa tu correo y selecciona tu rol en la empresa.'
      );
    } catch (error: any) {
      console.error('Error durante el registro:', error);

      if (
        error.message &&
        error.message.includes(
          'For security purposes, you can only request this after'
        )
      ) {
        this.showErrorDialog(
          'Debes esperar 1 minuto antes de hacer otra solicitud.'
        );
      } else {
        console.error(error);
      }
    }
  }

  private showErrorDialog(message: string) {
    this.dialog.open(DialogError, {
      data: { message },
      width: '400px',
      disableClose: false,
    });
  }
  private showSuccessDialog(message: string) {
    const dialogRef = this.dialog.open(Dialog, {
      data: {
        message: message,
      },
      width: '450px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userRole.set(result);
        console.log('Rol del usuario guardado:', this.userRole());
      }
    });
  }
}
