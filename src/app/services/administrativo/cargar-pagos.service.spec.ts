import { TestBed, inject } from '@angular/core/testing';

import { CargarPagosService } from './cargar-pagos.service';

describe('CargarPagosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CargarPagosService]
    });
  });

  it('should be created', inject([CargarPagosService], (service: CargarPagosService) => {
    expect(service).toBeTruthy();
  }));
});
