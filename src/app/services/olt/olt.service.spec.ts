import { TestBed, inject } from '@angular/core/testing';

import { OltService } from './olt.service';

describe('OltService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OltService]
    });
  });

  it('should be created', inject([OltService], (service: OltService) => {
    expect(service).toBeTruthy();
  }));
});
