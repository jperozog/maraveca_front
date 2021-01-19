import { TestBed, inject } from '@angular/core/testing';

import { DetallesArticulosService } from './detalles-articulos.service';

describe('DetallesArticulosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetallesArticulosService]
    });
  });

  it('should be created', inject([DetallesArticulosService], (service: DetallesArticulosService) => {
    expect(service).toBeTruthy();
  }));
});
