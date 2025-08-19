import {
  Component,
  inject,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsersInterface } from '../../../../../../../shared/interfaces/users/user.interface';
import { UsersService } from '../../services/users.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUsers } from '../update-users/update-users';
import { DialogLoading } from '../../../../../../../shared/components/dialog-loading/dialog-loading';
import { DialogSuccess } from '../../../../../../../shared/components/dialog-success/dialog-success';
import { DeleteUsers } from '../delete-users/delete-users';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList {
  private userService = inject(UsersService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'id',
    'nombres',
    'apellidos',
    'email',
    'rol',
    'numero_ficha',
    'acciones',
  ];

  dataSource = new MatTableDataSource<UsersInterface>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  editarUsuario(user: UsersInterface) {
    const dialogRef = this.dialog.open(UpdateUsers, {
      width: '500px',
      data: user,
    });

    dialogRef
      .afterClosed()
      .subscribe(async (formData: Partial<UsersInterface> | undefined) => {
        if (formData) {
          const loadingRef = this.dialog.open(DialogLoading, {
            disableClose: true,
            data: { message: 'Actualizando usuario...' },
          });

          try {
            await this.userService.updateUserInfo(user.id_auth!, formData);
            loadingRef.close();
            this.dialog.open(DialogSuccess, {
              data: {
                title: 'Actualización exitosa',
                message: 'Usuario actualizado correctamente.',
              },
            });
            await this.loadUsers();
          } catch (error) {
            loadingRef.close();
            console.error('Error actualizando usuario:', error);
          }
        }
      });
  }

  eliminarUsuario(user: UsersInterface) {
    const dialogRef = this.dialog.open(DeleteUsers, {
      width: '400px',
      data: user,
    });

    dialogRef.afterClosed().subscribe(async (confirmado: boolean) => {
      if (confirmado) {
        const loadingRef = this.dialog.open(DialogLoading, {
          disableClose: true,
          data: { message: 'Eliminando usuario...' },
        });

        try {
          await this.userService.deactivateUser(user.id_auth!);

          loadingRef.close();

          this.dialog.open(DialogSuccess, {
            data: {
              title: 'Usuario eliminado',
              message: `El usuario ${user.nombres} ${user.apellidos} ha sido eliminado correctamente.`,
            },
          });

          await this.loadUsers();
        } catch (error) {
          loadingRef.close();
          console.error('Error eliminando usuario:', error);
        }
      }
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async loadUsers() {
    const users = await this.userService.getUsers();
    if (users) {
      // Solo usuarios activos
      this.dataSource.data = users.filter((u) => u.estado === 'Activo');
    }
  }
}
