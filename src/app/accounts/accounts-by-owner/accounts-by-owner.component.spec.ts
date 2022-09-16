import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsByOwnerComponent } from './accounts-by-owner.component';

describe('AccountsByOwnerComponent', () => {
  let component: AccountsByOwnerComponent;
  let fixture: ComponentFixture<AccountsByOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsByOwnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsByOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
