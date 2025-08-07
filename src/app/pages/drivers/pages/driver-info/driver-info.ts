import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../shared/auth/auth.service';

@Component({
  selector: 'app-driver-info',
  imports: [],
  templateUrl: './driver-info.html',
  styleUrl: './driver-info.scss'
})
export default class DriverInfo {
authService = inject(AuthService);
  signOut(){
    this.authService.signOut()
  }
}
