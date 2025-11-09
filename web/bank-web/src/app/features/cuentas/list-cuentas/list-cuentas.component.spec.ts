import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCuentasComponent } from './list-cuentas.component';

describe('ListCuentasComponent', () => {
  let component: ListCuentasComponent;
  let fixture: ComponentFixture<ListCuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCuentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
