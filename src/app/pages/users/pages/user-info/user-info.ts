import { Component, inject } from '@angular/core';
import { DataAccessService } from '../../../../shared/services/data.access.service';
import { AuthService } from '../../../../shared/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-info',
  imports: [MatButtonModule],
  templateUrl: './user-info.html',
  styleUrl: './user-info.scss',
})
export default class UserInfo {
  authService = inject(AuthService);
  signOut(){
    this.authService.signOut()
  }
}
