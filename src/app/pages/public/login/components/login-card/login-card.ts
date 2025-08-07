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
import { Router } from '@angular/router';
import { AuthService } from '../../../../../shared/auth/auth.service';
import { DialogError } from '../../../../../shared/components/dialog-error/dialog-error';
import { DialogLoading } from '../../../../../shared/components/dialog-loading/dialog-loading';

interface LogInForm {
  email: FormControl<null | string>;
  password: FormControl<null | string>;
}
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
  dialog = inject(MatDialog);
  router = inject(Router);
  hide = signal(true);
  changeValue = output();
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  private _formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  form = this._formBuilder.group<LogInForm>({
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

    const loadingRef = this.dialog.open(DialogLoading, {
      data: { message: 'Iniciando sesión...' },
      width: '400px',
      disableClose: true,
      panelClass: 'loading-dialog',
    });

    try {
      const { error, data } = await this.authService.logIn({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });

      if (error) throw new Error('Correo o contraseña incorrectos.');

      const userId = data.session?.user.id;
      if (!userId) throw new Error('No se pudo obtener el ID del usuario.');

      // Actualizar el mensaje mientras se obtiene el rol
      loadingRef.componentInstance.data = {
        message: 'Verificando permisos...',
      };

      const role = await this.authService.getUserRole(userId);

      // Cerramos el diálogo de carga correctamente
      loadingRef.close();

      // Si no hay rol, se redirige al setup
      if (!role) {
        this.router.navigate(['/role-setup']);
        return;
      }

      // Redirigir según el rol
      switch (role) {
        case 1:
          this.router.navigate(['/admin']);
          break;
        case 2:
          this.router.navigate(['/users']);
          break;
        case 3:
          this.router.navigate(['/drivers']);
          break;
        default:
          throw new Error('Rol no reconocido.');
      }
    } catch (err: any) {
      console.error('Error en login:', err);

      if (loadingRef) loadingRef.close();
      let message = 'Error inesperado. Intente de nuevo.';

      if (err instanceof Error) {
        if (err.message.includes('contraseña incorrectos')) {
          message = 'Correo o contraseña incorrectos.';
        } else if (err.message.includes('Rol no reconocido')) {
          message = err.message;
        }
      }

      this.dialog.open(DialogError, {
        data: { message },
        width: '400px',
      });
    }
  }
}
