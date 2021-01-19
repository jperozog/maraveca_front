import { TestBed, inject } from '@angular/core/testing';

import { ServidoresService } from './servidores.service';

describe('ServidoresService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServidoresService]
    });
  });

  it('should be created', inject([ServidoresService], (service: ServidoresService) => {
    expect(service).toBeTruthy();
  }));
});
