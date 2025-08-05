export interface UsersInterface{
  id_usuario: number,
  id_rol: number,
  numero_ficha?: string,
  ci: string,
  nombres: string,
  apellidos: string,
  numero_celular: string,
  correo_electronico: string,
  operacion?: string,
  confirma_salida_viernes?: boolean,
  confirma_retorno_domingo?: boolean,
  destino_seleccionado?: string,
  id_auth: string
}
