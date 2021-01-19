import { TestBed, inject } from '@angular/core/testing';

import { ComisionesVendedoresService } from './comisiones-vendedores.service';

describe('ComisionesVendedoresService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComisionesVendedoresService]
    });
  });

  it('should be created', inject([ComisionesVendedoresService], (service: ComisionesVendedoresService) => {
    expect(service).toBeTruthy();
  }));
});
