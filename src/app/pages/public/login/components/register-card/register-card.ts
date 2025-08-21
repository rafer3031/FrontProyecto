import { Component, signal, inject, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
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
import { AuthService } from '../../../../../shared/auth/auth.service';
import { DialogError } from '../../../../../shared/components/dialog-error/dialog-error';
import { DialogSuccess } from '../../../../../shared/components/dialog-success/dialog-success';
import { DialogLoading } from '../../../../../shared/components/dialog-loading/dialog-loading';

interface SignUpForm {
  email: FormControl<null | string>;
  password: FormControl<null | string>;
  confirmPassword: FormControl<null | string>;
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
  hideConfirmPassword = signal(true);

  private _formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  form = this._formBuilder.group<SignUpForm>({
    email: this._formBuilder.control(null, [Validators.required, Validators.email]),
    password: this._formBuilder.control(null, [Validators.required, Validators.minLength(6)]),
    confirmPassword: this._formBuilder.control(null, [Validators.required]),
  }, { validators: this.passwordMatchValidator });

  private passwordMatchValidator(control: any) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  clickEventConfirm(event: MouseEvent) {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
  }

  async submit() {
    if (this.form.invalid) return;

    // Rol fijo: 2
    localStorage.setItem('pendingUserRole', '2');

    const loadingRef = this.dialog.open(DialogLoading, {
      data: { message: 'Registrando usuario...' },
      width: '400px',
      disableClose: true,
      panelClass: 'loading-dialog',
    });

    try {
      await this.performRegistration();

      loadingRef.close();

      this.dialog.open(DialogSuccess, {
        data: {
          tittle: 'Registro exitoso',
          message: 'Por favor revise su correo electrónico para confirmar su cuenta.',
        },
        width: '450px',
      }).afterClosed().subscribe(() => {
        this.form.reset();
      });

    } catch (error) {
      loadingRef.close();

      let message = 'Error durante el registro. Por favor intenta nuevamente.';
      if (error instanceof Error) {
        if (error.message?.includes('For security purposes')) {
          message = 'Debes esperar 1 minuto antes de hacer otra solicitud.';
        } else {
          message = error.message;
        }
      }
      console.error(error);

      this.dialog.open(DialogError, {
        data: { message },
        width: '400px',
      });
    }
  }

  private async performRegistration(): Promise<void> {
    const authResponse = await this.authService.signUp({
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
    });

    if (authResponse.error) {
      throw authResponse.error;
    }
  }
}
