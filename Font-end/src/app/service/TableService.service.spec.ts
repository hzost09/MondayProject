/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TableServiceService } from './TableService.service';

describe('Service: TableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableServiceService]
    });
  });

  it('should ...', inject([TableServiceService], (service: TableServiceService) => {
    expect(service).toBeTruthy();
  }));
});
