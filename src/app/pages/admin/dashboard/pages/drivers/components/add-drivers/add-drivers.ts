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
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AuthService } from '../../../../../../../shared/auth/auth.service';
import { DialogError } from '../../../../../../../shared/components/dialog-error/dialog-error';
import { DialogLoading } from '../../../../../../../shared/components/dialog-loading/dialog-loading';
import { DialogSuccess } from '../../../../../../../shared/components/dialog-success/dialog-success';
import { DriverService } from '../../services/drivers.service';

interface SignUpForm {
  nombres: FormControl<null | string>;
  apellidos: FormControl<null | string>;
  ci: FormControl<null | string>;
  numero_celular: FormControl<null | string>;
  email: FormControl<null | string>;
  password: FormControl<null | string>;
}

@Component({
  selector: 'add-drivers-dialog',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './add-drivers.html',
  styleUrl: './add-drivers.scss',
})
export class AddDrivers {
  private dialogRef = inject(MatDialogRef<AddDrivers>);
  hide = signal(true);
  hideConfirmPassword = signal(true);
  private driversService = inject(DriverService);
  private _formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  form = this._formBuilder.group<SignUpForm>(
    {
      nombres: this._formBuilder.control(null, [
        Validators.required,
        Validators.maxLength(60),
      ]),
      apellidos: this._formBuilder.control(null, [
        Validators.required,
        Validators.maxLength(60),
      ]),
      ci: this._formBuilder.control(null, [
        Validators.required,
        Validators.maxLength(15),
      ]),
      numero_celular: this._formBuilder.control(null, [
        Validators.required,
        Validators.maxLength(15),
      ]),
      email: this._formBuilder.control(null, [
        Validators.required,
        Validators.email,
        Validators.maxLength(45),
      ]),
      password: this._formBuilder.control(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(45),
      ]),

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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loadingRef = this.dialog.open(DialogLoading, {
      data: { message: 'Registrando conductor...' },
      width: '400px',
      disableClose: true,
      panelClass: 'loading-dialog',
    });

    try {
      await this.performRegistration();

      loadingRef.close();

      this.dialog
        .open(DialogSuccess, {
          data: {
            tittle: 'Registro exitoso',
            message:
              'Conductor registrado exitosamente. Se ha enviado un correo de verificación.',
          },
          width: '450px',
        })
        .afterClosed()
        .subscribe(() => {
          this.form.reset();
          this.dialogRef.close(true);
        });
    } catch (error) {
      loadingRef.close();

      let message = 'Error durante el registro. Por favor intenta nuevamente.';

      if (error instanceof Error) {
        if (error.message?.includes('For security purposes')) {
          message = 'Debes esperar 1 minuto antes de hacer otra solicitud.';
        } else if (error.message?.includes('User already registered')) {
          message = 'El correo electrónico ya está registrado.';
        } else if (error.message?.includes('CI ya existe')) {
          message = 'La cédula de identidad ya está registrada.';
        } else {
          message = error.message;
        }
        console.error('Error en registro:', error.message);
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

    const user = authResponse.data?.user;

    if (!user) {
      throw new Error(
        'No se pudo obtener el usuario después del registro de autenticación.'
      );
    }
    await this.driversService.createDriver({
      id_auth: user.id,
      nombres: this.form.value.nombres ?? '',
      apellidos: this.form.value.apellidos ?? '',
      ci: this.form.value.ci ?? '',
      numero_celular: this.form.value.numero_celular ?? '',
      id_rol: 3, 
      estado: 'Activo',
    });
    
  }
}
