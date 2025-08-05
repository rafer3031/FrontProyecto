import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SupabaseService } from '../../../../../../shared/services/supabase.service';



@Injectable({providedIn: 'root'})
export class UsersService {
  supabaseService = inject(SupabaseService).supabase

  state = signal({

  })

  getAllUsers(){

  }

}
