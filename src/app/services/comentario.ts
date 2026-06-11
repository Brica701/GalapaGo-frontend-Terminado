import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  private apiUrl = 'https://galapago-backend-terminado.onrender.com/api/comentarios';

  constructor(private http: HttpClient) {}

  listarPorServicio(servicioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?servicioId=${servicioId}`);
  }

  publicar(comentario: any): Observable<any> {
    return this.http.post(this.apiUrl, comentario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
