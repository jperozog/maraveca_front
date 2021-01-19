import { TestBed, inject } from '@angular/core/testing';

import { InstalacionesService } from './instalaciones.service';

describe('InstalacionesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstalacionesService]
    });
  });

  it('should be created', inject([InstalacionesService], (service: InstalacionesService) => {
    expect(service).toBeTruthy();
  }));
});
