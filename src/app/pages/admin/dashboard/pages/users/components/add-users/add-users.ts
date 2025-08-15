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
import { Dialog } from '../../../../../../public/login/components/dialog/dialog';

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
  userRole = signal<string | null>(null);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  clickEventConfirm(event: MouseEvent) {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
  }

  private _formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);

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

  authService = inject(AuthService);

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

  onCancel() {
    this.dialogRef.close(false);
  }

  async submit() {
    if (this.form.invalid) return;

    const roleDialogRef = this.dialog.open(Dialog, {
      data: { message: 'Seleccione su función en la empresa' },
      width: '450px',
      disableClose: true,
    });

    roleDialogRef.afterClosed().subscribe(async (selectedRole) => {
      if (!selectedRole) return;

      this.userRole.set(selectedRole);
      localStorage.setItem('pendingUserRole', selectedRole);

      const loadingRef = this.dialog.open(DialogLoading, {
        data: { message: 'Registrando usuario...' },
        width: '400px',
        disableClose: true,
        panelClass: 'loading-dialog',
      });

      try {
        await this.performRegistration(selectedRole);

        loadingRef.close();

        this.dialog
          .open(DialogSuccess, {
            data: {
              tittle: 'Registro exitoso',
              message:
                'Por favor revise su correo electrónico para confirmar su cuenta.',

            },
            width: '450px',
            disableClose: false,
          })
          .afterClosed()
          .subscribe(() => {
            this.form.reset();
            this.dialogRef.close(true);
          });
      } catch (error) {
        loadingRef.close();

        let message =
          'Error durante el registro. Por favor intenta nuevamente.';

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
          disableClose: false,
        });
      }
    });
  }

  private async performRegistration(role: string): Promise<void> {
    const authResponse = await this.authService.signUp({
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
    });

    if (authResponse.error) {
      throw authResponse.error;
    }
  }
}
