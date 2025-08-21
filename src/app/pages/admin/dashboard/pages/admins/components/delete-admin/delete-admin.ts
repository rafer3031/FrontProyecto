import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UsersInterface } from '../../../../../../../shared/interfaces/users/user.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-admin',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './delete-admin.html',
  styleUrl: './delete-admin.scss'
})
export class DeleteAdmin {
  readonly dialogRef = inject(MatDialogRef<DeleteAdmin>);
  readonly data = inject<UsersInterface>(MAT_DIALOG_DATA);
}
