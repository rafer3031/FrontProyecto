import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsersInterface } from '../../../../../../../shared/interfaces/users/user.interface';
import { UpdateDrivers } from '../update-drivers/update-drivers';
import { DialogLoading } from '../../../../../../../shared/components/dialog-loading/dialog-loading';
import { DialogSuccess } from '../../../../../../../shared/components/dialog-success/dialog-success';
import { DriverService } from '../../services/drivers.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-list-drivers',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './list-drivers.html',
  styleUrl: './list-drivers.scss',
})
export class ListDrivers {
  private dialog = inject(MatDialog);
  private driversService = inject(DriverService);
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
    const dialogRef = this.dialog.open(UpdateDrivers, {
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
            await this.driversService.updateDriverInfo(user.id_auth!, formData);
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
  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async loadUsers() {
    const users = await this.driversService.getDrivers();
    if (users) {
      this.dataSource.data = users.filter((u) => u.estado === 'Activo');
    }
  }
}
