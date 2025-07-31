import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DrawerService } from '../../../services/drawer.service';
@Component({
  selector: 'tool-bar',
  imports: [MatToolbarModule, MatIconModule],
  templateUrl: './tool-bar.html',
  styleUrl: './tool-bar.scss',
})
export class ToolBar {
  private drawerService = inject(DrawerService);

  toggleDrawer() {
    this.drawerService.toggleDrawer();
  }
}
