import { computed, inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from '../../../../../../shared/services/supabase.service';
import { AuthService } from '../../../../../../shared/auth/auth.service';
import {
  UsersInterface,
  UserState,
} from '../../../../../../shared/interfaces/users/user.interface';

@Injectable({ providedIn: 'root' })
export class AdminService {
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
  async updateAdminInfo(
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
        })
        .eq('id_auth', userIdAuth)
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
  async getAdmins() {
    try {
      this.state.update((state) => ({
        ...state,
        loading: true,
      }));

      const { data } = await this.supabaseClient
        .from('usuarios')
        .select()
        .eq('id_rol', 1)
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
  async createAdmin(formData: Partial<UsersInterface>): Promise<void> {
    try {
      if (
        !formData.id_auth ||
        !formData.nombres ||
        !formData.apellidos ||
        !formData.ci
      ) {
        throw new Error(
          'Todos los campos son requeridos para crear el administrador.'
        );
      }

      const { data: existingUser, error: checkError } =
        await this.supabaseClient
          .from('usuarios')
          .select('id_auth, ci')
          .eq('id_auth', formData.id_auth)
          .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error al verificar usuario existente:', checkError);
        throw new Error('Error al verificar existencia del usuario.');
      }

      if (existingUser && existingUser.ci && existingUser.ci !== formData.ci) {
        throw new Error(
          'La cédula de identidad ya está registrada en otro usuario.'
        );
      }

      const { data, error } = await this.supabaseClient
        .from('usuarios')
        .upsert(
          {
            id_auth: formData.id_auth,
            nombres: formData.nombres.trim(),
            apellidos: formData.apellidos.trim(),
            ci: formData.ci.trim(),
            numero_celular: formData.numero_celular?.trim(),
            id_rol: formData.id_rol || 1,
            estado: formData.estado || 'Activo',
          },
          { onConflict: 'id_auth' }
        )
        .select();

      if (error) {
        console.error(
          'Error de Supabase al registrar/actualizar administrador:',
          error
        );
        throw new Error(`Error al registrar administrador: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error(
          'No se pudo crear o actualizar el registro del administrador.'
        );
      }

      console.log('Administrador creado/actualizado exitosamente:', data);

      this.state.update((state) => ({
        ...state,
        data: [...state.data, ...data],
      }));
    } catch (error) {
      console.error('Error en createDriver:', error);
      throw error instanceof Error
        ? error
        : new Error('Error desconocido al crear el administrador.');
    }
  }
  async deactivateAdmin(userIdAuth: string): Promise<void> {
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
