import { TestBed, inject } from '@angular/core/testing';

import { VentasEquiposService } from './ventas-equipos.service';

describe('VentasEquiposService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VentasEquiposService]
    });
  });

  it('should be created', inject([VentasEquiposService], (service: VentasEquiposService) => {
    expect(service).toBeTruthy();
  }));
});
