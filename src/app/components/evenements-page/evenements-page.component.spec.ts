import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementsPageComponent } from './evenements-page.component';

describe('EvenementsPageComponent', () => {
  let component: EvenementsPageComponent;
  let fixture: ComponentFixture<EvenementsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvenementsPageComponent]
    });
    fixture = TestBed.createComponent(EvenementsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
