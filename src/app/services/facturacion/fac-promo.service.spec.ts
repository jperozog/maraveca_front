import { TestBed, inject } from '@angular/core/testing';

import { FacPromoService } from './fac-promo.service';

describe('FacPromoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacPromoService]
    });
  });

  it('should be created', inject([FacPromoService], (service: FacPromoService) => {
    expect(service).toBeTruthy();
  }));
});
