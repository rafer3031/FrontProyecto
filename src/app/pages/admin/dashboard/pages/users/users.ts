import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {  MatIconModule } from '@angular/material/icon';
import { UsersList } from "./components/users-list/users-list";

@Component({
  selector: 'app-users',
  imports: [MatButtonModule, MatIconModule, UsersList],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export default class Users {

}
