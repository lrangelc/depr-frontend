import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteFormComponent } from './favorite-form.component';

describe('FavoriteFormComponent', () => {
  let component: FavoriteFormComponent;
  let fixture: ComponentFixture<FavoriteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
