export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;

  precioBase: number;
  imagenUrl: string;
  categoria: string;
  ubicacion: string;
  cupoDisponible: number;

  destacado: boolean;
  capacidad_max_persona: number;
}
