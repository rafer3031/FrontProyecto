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
import { AdminService } from '../../services/admins.service';

interface SignUpForm {
  nombres: FormControl<null | string>;
  apellidos: FormControl<null | string>;
  ci: FormControl<null | string>;
  numero_celular: FormControl<null | string>;
  email: FormControl<null | string>;
  password: FormControl<null | string>;
}

@Component({
  selector: 'add-admin-dialog',
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
  templateUrl: './add-admin.html',
  styleUrl: './add-admin.scss',
})
export class AddAdmin {
  private dialogRef = inject(MatDialogRef<AddAdmin>);
  hide = signal(true);
  hideConfirmPassword = signal(true);
  private adminService = inject(AdminService);
  private _formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  form = this._formBuilder.group<SignUpForm>({
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
  });

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
    await this.adminService.createAdmin({
      id_auth: user.id,
      nombres: this.form.value.nombres ?? '',
      apellidos: this.form.value.apellidos ?? '',
      ci: this.form.value.ci ?? '',
      numero_celular: this.form.value.numero_celular ?? '',
      id_rol: 1,
      estado: 'Activo',
    });
  }
}
