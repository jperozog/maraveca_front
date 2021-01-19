import { TestBed, inject } from '@angular/core/testing';

import { CajaDistribucionService } from './caja-distribucion.service';

describe('CajaDistribucionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CajaDistribucionService]
    });
  });

  it('should be created', inject([CajaDistribucionService], (service: CajaDistribucionService) => {
    expect(service).toBeTruthy();
  }));
});
