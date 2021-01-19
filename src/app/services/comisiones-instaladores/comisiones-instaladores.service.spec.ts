import { TestBed, inject } from '@angular/core/testing';

import { ComisionesInstaladoresService } from './comisiones-instaladores.service';

describe('ComisionesInstaladoresService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComisionesInstaladoresService]
    });
  });

  it('should be created', inject([ComisionesInstaladoresService], (service: ComisionesInstaladoresService) => {
    expect(service).toBeTruthy();
  }));
});
