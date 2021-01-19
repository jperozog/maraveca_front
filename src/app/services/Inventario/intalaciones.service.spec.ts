import { TestBed, inject } from '@angular/core/testing';

import { IntalacionesService } from './intalaciones.service';

describe('IntalacionesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IntalacionesService]
    });
  });

  it('should be created', inject([IntalacionesService], (service: IntalacionesService) => {
    expect(service).toBeTruthy();
  }));
});
