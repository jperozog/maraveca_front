import { TestBed, inject } from '@angular/core/testing';

import { InfraestructuraService } from './infraestructura.service';

describe('InfraestructuraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfraestructuraService]
    });
  });

  it('should be created', inject([InfraestructuraService], (service: InfraestructuraService) => {
    expect(service).toBeTruthy();
  }));
});
