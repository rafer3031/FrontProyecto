import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'dashboard-page-content',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './dashboard-page-content.html',
  styleUrl: './dashboard-page-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardPage {

}
