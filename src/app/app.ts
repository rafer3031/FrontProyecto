import {
  Component,
  inject,
  AfterViewInit,
  signal,
  OnInit,
  effect,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SupabaseService } from './login/services/supabase.service';
import { environment } from '../environments/environment.development';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Session } from '@supabase/supabase-js';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSidenavModule, MatProgressSpinnerModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  supabaseService = inject(SupabaseService);
  session = this.supabaseService.session;
  loading = signal(true);

  constructor() {}

  ngOnInit() {
    if (this.session()) {
      this.loading.set(false);
    } else {
      this.loading.set(false);
    }
  }
}
