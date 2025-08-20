import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ListDrivers } from './components/list-drivers/list-drivers';
import { MatDialog } from '@angular/material/dialog';
import { AddDrivers } from './components/add-drivers/add-drivers';

@Component({
  selector: 'app-drivers',
  imports: [MatIconModule, MatButtonModule, ListDrivers],
  templateUrl: './drivers.html',
  styleUrl: './drivers.scss',
})
export class Drivers {
  private dialog = inject(MatDialog);

  openAddDriversDialog() {
    const dialogRef = this.dialog.open(AddDrivers, {
      width: '500px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Usuario registrado exitosamente');
      }
    });
  }
}
