import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../../../../../shared/auth/auth.service';
import { UsersInterface, UserState } from '../../../../../../shared/interfaces/users/user.interface';
import { SupabaseService } from '../../../../../../shared/services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
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
  async getUsers() {
    try {
      this.state.update((state) => ({
        ...state,
        loading: true,
      }));


      const { data } = await this.supabaseClient
        .from('usuarios')
        .select()
        .eq('id_rol', 2)
        .overrideTypes<UsersInterface[]>();

      if (data) {
        this.state.update((state) => ({
          ...state,
          data: data,
        }));
      }

      return data;
    } catch (error) {
      this.state.update((state) => ({
        ...state,
        error: true,
      }));
      return null;
    } finally {
      this.state.update((state) => ({
        ...state,
        loading: false,
      }));
    }
  }
}
