import { TestBed } from '@angular/core/testing';

import { BankingTransactionsService } from './banking-transactions.service';

describe('BankingTransactionsService', () => {
  let service: BankingTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankingTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
