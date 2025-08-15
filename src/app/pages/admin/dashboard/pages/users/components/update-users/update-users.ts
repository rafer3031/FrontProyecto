import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UsersInterface } from '../../../../../../../shared/interfaces/users/user.interface';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-update-users',
  standalone: true,
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './update-users.html',
  styleUrl: './update-users.scss',
})
export class UpdateUsers {
  readonly dialogRef = inject(MatDialogRef<UpdateUsers>);
  readonly data = inject<UsersInterface>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);

  destinos = ['Oruro', 'La Paz', 'Cochabamba', 'Potosí'];

  form = this.fb.group({
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    ci: new FormControl('', Validators.required),
    numero_celular: new FormControl('', Validators.required),
    operacion: new FormControl('', Validators.required),
    numero_ficha: new FormControl(''),
    destino_origen: new FormControl('', Validators.required),
  });

  constructor() {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  guardar() {
    if (this.form.invalid) return;
    this.usersService
      .updateUserInfo(this.data.id_auth!, this.form.value)
      .then(() => {
        this.dialogRef.close(this.form.value);
      })
      .catch((err) => console.error('Error actualizando usuario:', err));
  }
}
