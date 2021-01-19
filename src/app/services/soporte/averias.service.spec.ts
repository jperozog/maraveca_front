import { TestBed, inject } from '@angular/core/testing';

import { AveriasService } from './averias.service';

describe('AveriasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AveriasService]
    });
  });

  it('should be created', inject([AveriasService], (service: AveriasService) => {
    expect(service).toBeTruthy();
  }));
});
