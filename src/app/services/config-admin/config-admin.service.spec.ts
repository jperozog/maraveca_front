import { TestBed, inject } from '@angular/core/testing';

import { ConfigAdminService } from './config-admin.service';

describe('ConfigAdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigAdminService]
    });
  });

  it('should be created', inject([ConfigAdminService], (service: ConfigAdminService) => {
    expect(service).toBeTruthy();
  }));
});
