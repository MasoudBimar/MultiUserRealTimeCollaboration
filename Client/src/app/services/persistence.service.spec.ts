import { TestBed } from '@angular/core/testing';

import { PersistenceService } from './persistence.service';

describe('PersistenceService', () => {
  let service: PersistenceService<T>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersistenceService<T>);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
