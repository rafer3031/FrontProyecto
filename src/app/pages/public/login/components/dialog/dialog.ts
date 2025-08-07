import { Component, inject, model, signal } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

interface DialogData {
  message: string;
}

@Component({
  selector: 'app-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatRadioModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  roleControl = new FormControl(null, Validators.required);
  selectedRole = signal<string | null>(null);

  readonly dialogRef = inject(MatDialogRef<Dialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  constructor() {
    this.dialogRef.disableClose = true;
    this.roleControl.valueChanges.subscribe(value => {
      if (value) {
        this.selectedRole.set(value);
        console.log('Rol seleccionado:', value);
      }
    });
  }

  onContinue() {
    if (this.roleControl.valid) {
      console.log('Continuando con rol:', this.selectedRole());
      this.dialogRef.close(this.selectedRole());
    }
  }
}
