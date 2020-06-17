import { TestBed } from '@angular/core/testing';

import { ClientCouponService } from './client-coupon.service';

describe('ClientCouponService', () => {
  let service: ClientCouponService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientCouponService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
