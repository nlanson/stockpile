import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditItemPage } from './edit-item.page';

describe('EditItemPage', () => {
  let component: EditItemPage;
  let fixture: ComponentFixture<EditItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditItemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
