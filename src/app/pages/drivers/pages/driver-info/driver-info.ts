import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../shared/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-driver-info',
  imports: [MatButtonModule],
  templateUrl: './driver-info.html',
  styleUrl: './driver-info.scss'
})
export default class DriverInfo {
authService = inject(AuthService);
  signOut(){
    this.authService.signOut()
  }
}
