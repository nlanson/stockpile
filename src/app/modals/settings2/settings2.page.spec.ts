import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Settings2Page } from './settings2.page';

describe('Settings2Page', () => {
  let component: Settings2Page;
  let fixture: ComponentFixture<Settings2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Settings2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Settings2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
