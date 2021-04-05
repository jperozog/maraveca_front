import { TestBed, inject } from '@angular/core/testing';

import { PresupuestosService } from './presupuestos.service';

describe('PresupuestosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PresupuestosService]
    });
  });

  it('should be created', inject([PresupuestosService], (service: PresupuestosService) => {
    expect(service).toBeTruthy();
  }));
});
