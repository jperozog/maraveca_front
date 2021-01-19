import { TestBed, inject } from '@angular/core/testing';

import { PclienteService } from './pcliente.service';

describe('PclienteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PclienteService]
    });
  });

  it('should be created', inject([PclienteService], (service: PclienteService) => {
    expect(service).toBeTruthy();
  }));
});
