import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { Session, SignInWithPasswordCredentials } from '@supabase/supabase-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  supabaseService = inject(SupabaseService).supabase;

  session() {
    return this.supabaseService.auth.getSession();
  }

  signUp(credentials: SignInWithPasswordCredentials) {
    return this.supabaseService.auth.signUp(credentials);
  }

  logIn(credentials: SignInWithPasswordCredentials) {
    return this.supabaseService.auth.signInWithPassword(credentials);
  }

  signOut() {
    return this.supabaseService.auth.signOut();
  }

  recoverPassword(email: string) {
    return this.supabaseService.auth.resetPasswordForEmail(email);
  }

  async getSession(): Promise<Session | null> {
    const { data } = await this.supabaseService.auth.getSession();
    return data.session;
  }
  async getUserRole(id_auth: string): Promise<number | null> {
    const { data, error } = await this.supabaseService
      .from('usuarios')
      .select('id_rol')
      .eq('id_auth', id_auth)
      .maybeSingle();

    if (error || !data) return null;
    return data.id_rol;
  }
  async getUserName(id_auth: string): Promise<number | null> {
    const { data, error } = await this.supabaseService
      .from('usuarios')
      .select('nombres')
      .eq('id_auth', id_auth)
      .maybeSingle();

    if (error || !data) return null;
    return data.nombres;
  }
}
