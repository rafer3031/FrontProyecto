import { Component, inject, signal } from '@angular/core';
import { DataAccessService } from '../../../../shared/services/data.access.service';
import { AuthService } from '../../../../shared/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterOutlet } from '@angular/router';
import { DialogLoading } from '../../../../shared/components/dialog-loading/dialog-loading';
import { DialogError } from '../../../../shared/components/dialog-error/dialog-error';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SupabaseService } from '../../../../shared/services/supabase.service';
import { UsersInterface } from '../../../../shared/interfaces/users/user.interface';
import { ToolBar } from '../../components/tool-bar/tool-bar';

@Component({
  selector: 'app-user-info',
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, ToolBar, RouterOutlet],
  templateUrl: './user-info.html',
  styleUrl: './user-info.scss',
})
export default class UserInfo {
  dataAccessService = inject(DataAccessService);

  user = signal<UsersInterface | null>(null);
  ngOnInit() {
    this.getInfoUser();
  }
  async getInfoUser() {
    const response = await this.dataAccessService.getAllUsers();
    if (response && response.length > 0) {
      this.user.set(response[0]);
    }
  }
}
