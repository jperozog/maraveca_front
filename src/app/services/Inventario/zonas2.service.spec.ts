import { TestBed, inject } from '@angular/core/testing';

import { Zonas2Service } from './zonas2.service';

describe('Zonas2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Zonas2Service]
    });
  });

  it('should be created', inject([Zonas2Service], (service: Zonas2Service) => {
    expect(service).toBeTruthy();
  }));
});
