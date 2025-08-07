import { Component, inject } from '@angular/core';
import { DataAccessService } from '../../../../shared/services/data.access.service';

@Component({
  selector: 'app-user-info',
  imports: [],
  templateUrl: './user-info.html',
  styleUrl: './user-info.scss',
})
export default class UserInfo {
  dataAccessService = inject(DataAccessService);
}
