import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
export interface DialogData {
  message: string;
}
@Component({
  selector: 'app-dialog-error',
  imports: [MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './dialog-error.html',
  styleUrl: './dialog-error.scss'
})
export class DialogError {
  readonly dialogRef = inject(MatDialogRef<DialogError>)
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
   close(): void {
    this.dialogRef.close();
  }
}
