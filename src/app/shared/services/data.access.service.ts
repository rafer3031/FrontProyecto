import { computed, inject, Injectable, signal } from '@angular/core';

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
        .eq('id_auth', session?.user.id)
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

  async updateRolUser(user: { id_rol: number }): Promise<void> {
    const session = await this.authService.getSession();

    if (!session?.user.id) {
      throw new Error('No hay sesión activa');
    }

    try {
      const { data, error } = await this.supabaseClient
        .from('usuarios')
        .update({
          id_rol: user.id_rol,
        })
        .eq('id_auth', session.user.id)
        .select();

      if (error) {
        console.error('Error de Supabase al actualizar rol:', error);
        throw new Error(`Error al actualizar rol: ${error.message}`);
      }

      console.log('Rol actualizado exitosamente:', data);
    } catch (error) {
      console.error('Error en updateRolUser:', error);
      throw error;
    }
  }

  async updateInfoUser(user: {
    numero_ficha: string | null;
    ci: string | null;
    nombres: string | null;
    apellidos: string | null;
    numero_celular: string | null;
    operacion: string |null;
  }): Promise<void> {
    const session = await this.authService.getSession();

    if (!session?.user.id) {
      throw new Error('No hay sesión activa');
    }

    if (!user.nombres?.trim() || !user.apellidos?.trim() || !user.ci?.trim()) {
      throw new Error('Los campos nombres, apellidos y CI son obligatorios');
    }

    try {
      const { data, error } = await this.supabaseClient
        .from('usuarios')
        .update({
          numero_ficha: user.numero_ficha,
          ci: user.ci.trim(),
          nombres: user.nombres.trim(),
          apellidos: user.apellidos.trim(),
          numero_celular: user.numero_celular?.trim(),
          operacion: user.operacion?.trim(),
        })
        .eq('id_auth', session.user.id)
        .select();

      if (error) {
        console.error('Error de Supabase al actualizar info:', error);
        throw new Error(`Error al actualizar información: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('No se encontró el usuario para actualizar');
      }

      console.log('Información actualizada exitosamente:', data);

      await this.getAllUsers();

    } catch (error) {
      console.error('Error en updateInfoUser:', error);
      throw error;
    }
  }

  async checkUserInfoComplete(): Promise<boolean> {
    try {
      const session = await this.authService.getSession();

      if (!session?.user.id) {
        return false;
      }

      const { data, error } = await this.supabaseClient
        .from('usuarios')
        .select('nombres, apellidos, ci, numero_celular, operacion')
        .eq('id_auth', session.user.id)
        .single();

      if (error) {
        console.error('Error al verificar información del usuario:', error);
        return false;
      }

      return !!(
        data?.nombres &&
        data?.apellidos &&
        data?.ci &&
        data?.numero_celular &&
        data?.operacion
      );

    } catch (error) {
      console.error('Error en checkUserInfoComplete:', error);
      return false;
    }
  }
}
