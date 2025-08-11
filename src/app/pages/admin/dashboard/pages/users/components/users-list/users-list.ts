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
import {MatTooltipModule} from '@angular/material/tooltip';
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './users-list.html',
  styleUrl: './users-list.scss',
})
export class UsersList implements OnInit, AfterViewInit {
  private userService = inject(UsersService);

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
    console.log('Editar usuario', user);
  }

  eliminarUsuario(user: UsersInterface) {
    console.log('Eliminar usuario', user);
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
      this.dataSource.data = users;
    }
  }
}
