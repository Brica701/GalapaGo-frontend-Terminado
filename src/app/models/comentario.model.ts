export interface Comentario {
  id?: number;
  usuario: { id: number; nombre?: string };
  servicio: { id: number };
  puntuacion: number;
  texto: string;
  respuestaAdmin?: string;
  fechaPublicacion?: string;
}
