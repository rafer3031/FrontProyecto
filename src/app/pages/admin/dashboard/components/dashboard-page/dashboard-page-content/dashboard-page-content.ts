import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dashboard-page-content',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './dashboard-page-content.html',
  styleUrl: './dashboard-page-content.scss'
})
export default class DashboardPage {

}
