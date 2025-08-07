import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DataAccessService } from '../../../../shared/services/data.access.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AuthService } from '../../../../shared/auth/auth.service';
import { Router } from '@angular/router';
import {
  DialogData,
  DialogError,
} from '../../../../shared/components/dialog-error/dialog-error';
import {
  DialogLoading,
  LoadingData,
} from '../../../../shared/components/dialog-loading/dialog-loading';
interface UpdateInfoUserForm {
  numero_ficha: FormControl<null | string>;
  ci: FormControl<null | string>;
  nombres: FormControl<null | string>;
  apellidos: FormControl<null | string>;
  numero_celular: FormControl<null | string>;
  operacion: FormControl<null | string>;
}
@Component({
  selector: 'app-complete-info',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './complete-info.html',
  styleUrl: './complete-info.scss',
})
export class CompleteInfo {
  esBolivar = false;
  esVisitante = false;
  isSubmitting = false;

  private dataAccessService = inject(DataAccessService);
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<CompleteInfo>);
  private formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  form = this.formBuilder.group<UpdateInfoUserForm>({
    numero_ficha: this.formBuilder.control(
      { value: null, disabled: this.esVisitante },
      this.esVisitante ? [] : [Validators.required]
    ),
    ci: this.formBuilder.control(null, [Validators.required]),
    nombres: this.formBuilder.control(null, [Validators.required]),
    apellidos: this.formBuilder.control(null, [Validators.required]),
    numero_celular: this.formBuilder.control(null, [Validators.required]),
    operacion: this.formBuilder.control(null, [Validators.required]),
  });

  toggleBolivar() {
    const operacionControl = this.form.controls.operacion;

    if (this.esBolivar) {
      operacionControl.setValue('Bolívar');
      operacionControl.disable();
    } else {
      operacionControl.reset();
      operacionControl.enable();
    }
  }

  toggleVisitante() {
    this.esVisitante = !this.esVisitante;
    const fichaControl = this.form.get('numero_ficha');

    if (this.esVisitante) {
      fichaControl?.clearValidators();
      fichaControl?.setValue(null);
      fichaControl?.disable();
    } else {
      fichaControl?.setValidators([Validators.required]);
      fichaControl?.enable();
    }

    fichaControl?.updateValueAndValidity();
  }

  async submit() {
    if (this.form.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    let loadingDialogRef: any = null;

    try {
      const userData = this.form.getRawValue();
      const processedData = {
        ...userData,
        numero_ficha: userData.numero_ficha?.trim() || null,
      };

      console.log('Datos a enviar:', processedData);

      loadingDialogRef = this.showLoadingDialog('Validando información...');

      await new Promise((resolve) => setTimeout(resolve, 500));

      this.updateLoadingMessage(loadingDialogRef, 'Guardando información...');

      await this.dataAccessService.updateInfoUser(processedData);
      this.updateLoadingMessage(loadingDialogRef, 'Finalizando...');

      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log('Información de usuario actualizada exitosamente');

      loadingDialogRef.close();
      this.dialogRef.close({ success: true });
      this.router.navigate(['/users']);
    } catch (error) {
      console.error('Error al actualizar información:', error);
      this.isSubmitting = false;
      if (loadingDialogRef) {
        loadingDialogRef.close();
      }

      this.showErrorDialog(error);
    }
  }

  private showLoadingDialog(message: string) {
    return this.dialog.open(DialogLoading, {
      data: { message } as LoadingData,
      disableClose: true,
      width: '300px',
      panelClass: 'loading-dialog',
    });
  }

  private updateLoadingMessage(dialogRef: any, newMessage: string) {
    if (dialogRef && dialogRef.componentInstance) {
      dialogRef.componentInstance.data.message = newMessage;
    }
  }

  private showErrorDialog(error: any) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Error al actualizar la información. Inténtelo nuevamente.';

    this.dialog.open(DialogError, {
      data: { message: errorMessage } as DialogData,
      width: '400px',
      panelClass: 'error-dialog',
    });
  }
}
