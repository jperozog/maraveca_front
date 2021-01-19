import { TestBed, inject } from '@angular/core/testing';

import { PagoComisionesService } from './pago-comisiones.service';

describe('PagoComisionesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PagoComisionesService]
    });
  });

  it('should be created', inject([PagoComisionesService], (service: PagoComisionesService) => {
    expect(service).toBeTruthy();
  }));
});
