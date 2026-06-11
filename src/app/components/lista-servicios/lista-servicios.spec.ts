import { ComponentFixture, TestBed } from '@angular/core/testing';

// 1. Corregimos la ruta para que coincida con el nombre del archivo .ts
import { ListaServiciosComponent } from './lista-servicios';

describe('ListaServiciosComponent', () => {
  let component: ListaServiciosComponent;
  let fixture: ComponentFixture<ListaServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 2. Importamos la clase correcta
      imports: [ListaServiciosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Es mejor usar detectChanges() para inicializar el ciclo de vida
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
