import { TestBed, inject } from '@angular/core/testing';

import { CuentasIncobrablesService } from './cuentas-incobrables.service';

describe('CuentasIncobrablesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CuentasIncobrablesService]
    });
  });

  it('should be created', inject([CuentasIncobrablesService], (service: CuentasIncobrablesService) => {
    expect(service).toBeTruthy();
  }));
});
