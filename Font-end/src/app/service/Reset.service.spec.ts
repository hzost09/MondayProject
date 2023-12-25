/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ResetService } from './Reset.service';

describe('Service: Reset', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResetService]
    });
  });

  it('should ...', inject([ResetService], (service: ResetService) => {
    expect(service).toBeTruthy();
  }));
});
