import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnSiteServicesComponent } from './on-site-services.component';

describe('OnSiteServicesComponent', () => {
  let component: OnSiteServicesComponent;
  let fixture: ComponentFixture<OnSiteServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnSiteServicesComponent]
    });
    fixture = TestBed.createComponent(OnSiteServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
