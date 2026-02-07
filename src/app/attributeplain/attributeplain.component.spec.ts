import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeplainComponent } from './attributeplain.component';

describe('AttributeplainComponent', () => {
  let component: AttributeplainComponent;
  let fixture: ComponentFixture<AttributeplainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeplainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
