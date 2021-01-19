import { TestBed, inject } from '@angular/core/testing';

import { OrdenTrasladoService } from './orden-traslado.service';

describe('OrdenTrasladoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdenTrasladoService]
    });
  });

  it('should be created', inject([OrdenTrasladoService], (service: OrdenTrasladoService) => {
    expect(service).toBeTruthy();
  }));
});
