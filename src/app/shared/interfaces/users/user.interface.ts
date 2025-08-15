export interface UsersInterface {
  id_rol?: number | null;
  numero_ficha?: string | null;
  ci?: string | null;
  nombres?: string | null;
  apellidos?: string | null;
  numero_celular?: string | null;
  correo_electronico?: string | null;
  operacion?: string | null;
  destino_origen?: string | null;
  estado?: string | null;
  id_auth?: string | null;
}

export interface UserState{
  data: UsersInterface[],
  loading: boolean,
  error: boolean
}
