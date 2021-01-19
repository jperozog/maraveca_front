import { TestBed, inject } from '@angular/core/testing';

import { ApsService } from './aps.service';

describe('ApsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApsService]
    });
  });

  it('should be created', inject([ApsService], (service: ApsService) => {
    expect(service).toBeTruthy();
  }));
});
