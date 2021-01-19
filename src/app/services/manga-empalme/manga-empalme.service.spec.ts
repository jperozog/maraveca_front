import { TestBed, inject } from '@angular/core/testing';

import { MangaEmpalmeService } from './manga-empalme.service';

describe('MangaEmpalmeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MangaEmpalmeService]
    });
  });

  it('should be created', inject([MangaEmpalmeService], (service: MangaEmpalmeService) => {
    expect(service).toBeTruthy();
  }));
});
