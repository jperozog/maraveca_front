import { TestBed, inject } from '@angular/core/testing';

import { FactibilidadesService } from './factibilidades.service';

describe('FactibilidadesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FactibilidadesService]
    });
  });

  it('should be created', inject([FactibilidadesService], (service: FactibilidadesService) => {
    expect(service).toBeTruthy();
  }));
});
