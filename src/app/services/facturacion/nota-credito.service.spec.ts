import { TestBed, inject } from '@angular/core/testing';

import { NotaCreditoService } from './nota-credito.service';

describe('NotaCreditoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotaCreditoService]
    });
  });

  it('should be created', inject([NotaCreditoService], (service: NotaCreditoService) => {
    expect(service).toBeTruthy();
  }));
});
