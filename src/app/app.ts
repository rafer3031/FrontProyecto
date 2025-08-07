import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataAccessService } from './shared/services/data.access.service';
import { AuthService } from './shared/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, MatProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
