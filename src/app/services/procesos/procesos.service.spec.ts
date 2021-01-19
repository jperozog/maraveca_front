import { TestBed, inject } from '@angular/core/testing';

import { ProcesosService } from './procesos.service';

describe('ProcesosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProcesosService]
    });
  });

  it('should be created', inject([ProcesosService], (service: ProcesosService) => {
    expect(service).toBeTruthy();
  }));
});
