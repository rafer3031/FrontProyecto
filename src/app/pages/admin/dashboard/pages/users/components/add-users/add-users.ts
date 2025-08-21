import { Component, signal, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../../../../../shared/auth/auth.service';
import { DialogError } from '../../../../../../../shared/components/dialog-error/dialog-error';
import { DialogLoading } from '../../../../../../../shared/components/dialog-loading/dialog-loading';
import { DialogSuccess } from '../../../../../../../shared/components/dialog-success/dialog-success';

interface SignUpForm {
  email: FormControl<null | string>;
  password: FormControl<null | string>;
  confirmPassword: FormControl<null | string>;
}

@Component({
  selector: 'add-user-dialog',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './add-users.html',
  styleUrl: './add-users.scss',
})
export class AddUserDialog {
  private dialogRef = inject(MatDialogRef<AddUserDialog>);
  hide = signal(true);
  hideConfirmPassword = signal(true);

  private _formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  form = this._formBuilder.group<SignUpForm>(
    {
      email: this._formBuilder.control(null, [
        Validators.required,
        Validators.email,
      ]),
      password: this._formBuilder.control(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: this._formBuilder.control(null, [Validators.required]),
    },
    { validators: this.passwordMatchValidator }
  );

  private passwordMatchValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  clickEventConfirm(event: MouseEvent) {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
  }

  onCancel() {
    this.dialogRef.close(false);
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
        this.dialogRef.close(true);
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
        console.error(error.message);
      } else {
        console.error('Error desconocido:', error);
      }

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
