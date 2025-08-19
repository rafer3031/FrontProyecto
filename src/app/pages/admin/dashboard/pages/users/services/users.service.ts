import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../../../../../shared/auth/auth.service';
import {
  UsersInterface,
  UserState,
} from '../../../../../../shared/interfaces/users/user.interface';
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
        .eq('estado', 'Activo')
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
  async updateUserInfo(
    userIdAuth: string,
    formData: Partial<UsersInterface>
  ): Promise<void> {
    try {
      const { data, error } = await this.supabaseClient
        .from('usuarios')
        .update({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          ci: formData.ci,
          numero_celular: formData.numero_celular,
          operacion: formData.operacion,
          numero_ficha: formData.numero_ficha,
          destino_origen: formData.destino_origen,
        })
        .eq('id_auth', userIdAuth) // aquí ya no usamos el usuario logueado
        .select();

      if (error) {
        console.error('Error de Supabase al actualizar usuario:', error);
        throw new Error(`Error al actualizar usuario: ${error.message}`);
      }

      console.log('Usuario actualizado exitosamente:', data);
    } catch (error) {
      console.error('Error en updateUserInfo:', error);
      throw error;
    }
  }
  async deactivateUser(userIdAuth: string): Promise<void> {
    try {
      const { data, error } = await this.supabaseClient
        .from('usuarios')
        .update({ estado: 'Inactivo' })
        .eq('id_auth', userIdAuth)
        .select();
  
      if (error) {
        console.error('Error de Supabase al desactivar usuario:', error);
        throw new Error(`Error al desactivar usuario: ${error.message}`);
      }
  
      console.log('Usuario desactivado exitosamente:', data);
    } catch (error) {
      console.error('Error en deactivateUser:', error);
      throw error;
    }
  }
  
}
