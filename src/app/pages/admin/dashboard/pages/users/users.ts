import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { UsersList } from "./components/users-list/users-list";
import { AddUserDialog } from './components/add-users/add-users';

@Component({
  selector: 'app-users',
  imports: [MatButtonModule, MatIconModule, UsersList],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export default class Users {
  private dialog = inject(MatDialog);

  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserDialog, {
      width: '500px',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Usuario registrado exitosamente');
      }
    });
  }
}
