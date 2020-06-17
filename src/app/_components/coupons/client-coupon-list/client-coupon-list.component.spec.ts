import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCouponListComponent } from './client-coupon-list.component';

describe('ClientCouponListComponent', () => {
  let component: ClientCouponListComponent;
  let fixture: ComponentFixture<ClientCouponListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientCouponListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCouponListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
