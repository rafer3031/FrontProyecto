import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsersInterface } from '../../../../../../../shared/interfaces/users/user.interface';
import { UpdateAdmin } from '../update-admin/update-admin';
import { DialogLoading } from '../../../../../../../shared/components/dialog-loading/dialog-loading';
import { DialogSuccess } from '../../../../../../../shared/components/dialog-success/dialog-success';
import { AdminService } from '../../services/admins.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteAdmin } from '../delete-admin/delete-admin';

@Component({
  selector: 'app-list-admin',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './list-admin.html',
  styleUrl: './list-admin.scss',
})
export class ListAdmins {
  private dialog = inject(MatDialog);
  private adminService = inject(AdminService);
  displayedColumns: string[] = [
    'id',
    'nombres',
    'apellidos',
    'celular',
    'correo',
    'acciones',
  ];

  dataSource = new MatTableDataSource<UsersInterface>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  editarUsuario(user: UsersInterface) {
    const dialogRef = this.dialog.open(UpdateAdmin, {
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
            await this.adminService.updateAdminInfo(user.id_auth!, formData);
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
    const dialogRef = this.dialog.open(DeleteAdmin, {
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
          await this.adminService.deactivateAdmin(user.id_auth!);

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
    const users = await this.adminService.getAdmins();
    if (users) {
      this.dataSource.data = users.filter((u) => u.estado === 'Activo');
    }
  }
}
