import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtaContainerComponent } from './eta-container.component';

describe('EtaContainerComponent', () => {
  let component: EtaContainerComponent;
  let fixture: ComponentFixture<EtaContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtaContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtaContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
