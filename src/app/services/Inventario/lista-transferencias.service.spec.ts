import { TestBed, inject } from '@angular/core/testing';

import { ListaTransferenciasService } from './lista-transferencias.service';

describe('ListaTransferenciasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListaTransferenciasService]
    });
  });

  it('should be created', inject([ListaTransferenciasService], (service: ListaTransferenciasService) => {
    expect(service).toBeTruthy();
  }));
});
