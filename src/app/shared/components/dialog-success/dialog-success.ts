import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogData } from '../dialog-error/dialog-error';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-success',
  imports: [MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './dialog-success.html',
  styleUrl: './dialog-success.scss',
})
export class DialogSuccess {
  readonly dialogRef = inject(MatDialogRef<DialogSuccess>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  close(): void {
    this.dialogRef.close();
  }
}
