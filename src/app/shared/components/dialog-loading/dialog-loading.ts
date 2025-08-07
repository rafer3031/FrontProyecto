import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
export interface LoadingData {
  message: string;
}
@Component({
  selector: 'app-dialog-loading',
  imports: [MatDialogModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './dialog-loading.html',
  styleUrl: './dialog-loading.scss',
})
export class DialogLoading {
  data = inject<LoadingData>(MAT_DIALOG_DATA);
}
