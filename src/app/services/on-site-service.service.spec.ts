import { TestBed } from '@angular/core/testing';

import { OnSiteServiceService } from './on-site-service.service';

describe('OnSiteServiceService', () => {
  let service: OnSiteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnSiteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
