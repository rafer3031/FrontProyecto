import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dashboard-page-header',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './dashboard-page-header.html',
  styleUrl: './dashboard-page-header.scss'
})
export class DashboardPageHeader {

}
