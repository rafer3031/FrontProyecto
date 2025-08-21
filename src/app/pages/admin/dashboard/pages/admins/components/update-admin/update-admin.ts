import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { UpdateUsers } from '../../../users/components/update-users/update-users';
import { UsersInterface } from '../../../../../../../shared/interfaces/users/user.interface';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../../users/services/users.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-update-admin',
  imports: [
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './update-admin.html',
  styleUrl: './update-admin.scss',
})
export class UpdateAdmin {
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
      .catch((err) =>
        console.error('Error actualizando infomación del administrador:', err)
      );
  }
}
