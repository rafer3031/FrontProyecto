import { Component, inject, input, signal, viewChild } from '@angular/core';
import { ToolBar } from '../../components/tool-bar/tool-bar/tool-bar';
import { DashboardPageHeader } from '../../components/dashboard-page/dashboard-page-header/dashboard-page-header';
import { RouterOutlet } from '@angular/router';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { SideNavHeader } from '../../components/side-nav/side-nav-header/side-nav-header';
import { SideNavOptions } from '../../components/side-nav/side-nav-options/side-nav-options';
import { SideNavFooter } from '../../components/side-nav/side-nav-footer/side-nav-footer';
import { DrawerService } from '../../services/drawer.service';
import { SupabaseService } from '../../../login/services/supabase.service';
import { AuthSession } from '@supabase/supabase-js';
@Component({
  selector: 'app-nft-dashboard',
  standalone: true,
  imports: [
    ToolBar,
    DashboardPageHeader,
    RouterOutlet,
    MatSidenavModule,
    SideNavHeader,
    SideNavFooter,
    SideNavOptions,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export default class DashboardComponent {

  supabaseService = inject(SupabaseService);
  isHandset = signal(false);
  sidenavMode = signal<'side' | 'over'>('side');
  sidenavOpened = signal(true);
  drawerValue = viewChild(MatDrawer);
  private drawerService = inject(DrawerService);
  ngAfterViewInit(): void {
    const drawer = this.drawerValue();
    if (drawer) {
      this.drawerService.setDrawer(drawer);
    }
  }
}
