import { TestBed, inject } from '@angular/core/testing';

import { AlarmasService } from './alarmas.service';

describe('AlarmasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlarmasService]
    });
  });

  it('should be created', inject([AlarmasService], (service: AlarmasService) => {
    expect(service).toBeTruthy();
  }));
});
