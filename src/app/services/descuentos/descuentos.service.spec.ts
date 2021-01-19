import { TestBed, inject } from '@angular/core/testing';

import { DescuentosService } from './descuentos.service';

describe('DescuentosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DescuentosService]
    });
  });

  it('should be created', inject([DescuentosService], (service: DescuentosService) => {
    expect(service).toBeTruthy();
  }));
});
