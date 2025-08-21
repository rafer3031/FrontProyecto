import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAdmin } from './components/add-admin/add-admin';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ListAdmins } from './components/list-admin/list-admin';

@Component({
  selector: 'app-admins',
  imports: [MatIconModule, MatButtonModule, ListAdmins],
  templateUrl: './admins.html',
  styleUrl: './admins.scss'
})
export class Admins {
private dialog = inject(MatDialog);

  openAddAdminsDialog() {
    const dialogRef = this.dialog.open(AddAdmin, {
      width: '600px',
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
