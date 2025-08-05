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
    try {
      const { error, data } = await this.authService.logIn({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });
      if (error) throw error;

      const id_auth = data.session?.user.id;
      if (!id_auth) throw new Error('No se pudo obtener el ID del usuario');

      const role = await this.authService.getUserRole(id_auth);

      if (!role) {
        throw new Error('Este usuario no está registrado en el sistema.');
      }

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
    } catch (error) {
      let message = 'Ha ocurrido un error inesperado.';
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          message = 'Correo o contraseña incorrectos.';
        } else {
          message = error.message;
        }
        console.error(error.message);
      }

      this.dialog.open(DialogError, {
        data: { message },
      });
    }
  }
}
