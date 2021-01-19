import { TestBed, inject } from '@angular/core/testing';

import { CeldasService } from './celdas.service';

describe('CeldasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CeldasService]
    });
  });

  it('should be created', inject([CeldasService], (service: CeldasService) => {
    expect(service).toBeTruthy();
  }));
});
