import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DrawerService } from '../../../services/drawer.service';

@Component({
  selector: 'side-nav-options',
  imports: [
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './side-nav-options.html',
  styleUrl: './side-nav-options.scss',
})
export class SideNavOptions {
private drawerService = inject(DrawerService)

}
