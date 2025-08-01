import { Injectable, signal } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { Profile } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  session = signal<Session | null>(null);
  constructor() {
    this.supabase = createClient(
      environment.UrlProject,
      environment.ApiKeyPublic
    );
    this.initSessionListener();
  }
  private async initSessionListener() {
    const { data } = await this.supabase.auth.getSession();
    this.session.set(data.session ?? null);
    this.supabase.auth.onAuthStateChange((_, session) => {
      this.session.set(session);
    });
  }
  getCurrentProfile() {
    const session = this.session();
    if (!session) return Promise.resolve(null);

    return this.supabase
      .from('profiles')
      .select('id, rol')
      .eq('id', session.user.id)
      .single()
      .then(({ data, error }) => (error ? null : data));
  }
  async getSession(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }
  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  async signIn(email: string) {
    try {
      const result = await this.supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });

      if (result.error) throw result.error;
      return result;
    } catch (error: any) {
      throw this.translateError(error);
    }
  }
  updateProfile(profile: { id: string; rol: string }) {
    const update = {
      id: profile.id,
      rol: profile.rol,
      updated_at: new Date(),
    };

    return this.supabase.from('profiles').upsert(update, { onConflict: 'id' });
  }
  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single();
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path);
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file);
  }

  private translateError(error: Error): Error {
    const translations: { [key: string]: string } = {
      'One of email or phone must be set':
        'Debe llenar el formulario con un e-mail válido',
    };

    const translatedMessage =
      translations[error.message] ||
      'Debe esperar 1 minuto para envíar otra solicitud a este correo';
    return new Error(translatedMessage);
  }
}
