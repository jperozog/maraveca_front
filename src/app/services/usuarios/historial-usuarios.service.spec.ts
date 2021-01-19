import { TestBed, inject } from '@angular/core/testing';

import { HistorialUsuariosService } from './historial-usuarios.service';

describe('HistorialUsuariosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistorialUsuariosService]
    });
  });

  it('should be created', inject([HistorialUsuariosService], (service: HistorialUsuariosService) => {
    expect(service).toBeTruthy();
  }));
});
