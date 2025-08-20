import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDrivers } from './delete-drivers';

describe('DeleteDrivers', () => {
  let component: DeleteDrivers;
  let fixture: ComponentFixture<DeleteDrivers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteDrivers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDrivers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
