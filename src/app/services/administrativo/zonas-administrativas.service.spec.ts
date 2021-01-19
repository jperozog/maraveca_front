import { TestBed, inject } from '@angular/core/testing';

import { ZonasAdministrativasService } from './zonas-administrativas.service';

describe('ZonasAdministrativasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZonasAdministrativasService]
    });
  });

  it('should be created', inject([ZonasAdministrativasService], (service: ZonasAdministrativasService) => {
    expect(service).toBeTruthy();
  }));
});
