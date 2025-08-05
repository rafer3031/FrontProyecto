import { Injectable, signal } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {

  private _drawer = signal<MatDrawer | null>(null);
  drawer = this._drawer.asReadonly();

  setDrawer(drawer: MatDrawer) {
    this._drawer.set(drawer);
  }

  toggleDrawer() {
    const drawer = this._drawer();
    if (!drawer) return;
    drawer.toggle();
  }
}
