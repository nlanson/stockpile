import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewLocationPage } from './new-location.page';

describe('NewLocationPage', () => {
  let component: NewLocationPage;
  let fixture: ComponentFixture<NewLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLocationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
