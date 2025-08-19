import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UsersInterface } from '../../../../../../../shared/interfaces/users/user.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-users',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './delete-users.html',
  styleUrl: './delete-users.scss'
})
export class DeleteUsers {
  readonly dialogRef = inject(MatDialogRef<DeleteUsers>);
  readonly data = inject<UsersInterface>(MAT_DIALOG_DATA);
}
