import { computed, inject, Injectable, signal } from '@angular/core';
import {
  AuthChangeEvent,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { SupabaseService } from './supabase.service';
import { UsersInterface, UserState } from '../interfaces/users/user.interface';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataAccessService {
  supabaseClient = inject(SupabaseService).supabase;
  authService = inject(AuthService);

  state = signal<UserState>({
    data: [],
    loading: false,
    error: false,
  });
  users = computed(() => this.state().data);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  async getAllUsers() {
    try {
      this.state.update((state) => ({
        ...state,
        loading: true,
      }));
      const session = await this.authService.getSession();
      const { data } = await this.supabaseClient
        .from('usuarios')
        .select()
        .eq('user_id', session?.user.id)
        .overrideTypes<UsersInterface[]>();

      if (data) {
        this.state.update((state) => ({
          ...state,
          data: data,
        }));
      }
    } catch (error) {
      this.state.update((state) => ({
        ...state,
        error: true,
      }));
    } finally {
      this.state.update((state) => ({
        ...state,
        loading: false,
      }));
    }
  }
  async updateRolUser(user: { id_rol: number }) {
    const session = await this.authService.getSession();
    try {
      const response = await this.supabaseClient
        .from('usuarios')
        .update({
          id_rol: user.id_rol,
        })
        .eq('id_auth', session?.user.id);
      console.log(response);
    } catch (error) {}
  }
}
