import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddElementFormComponent } from './add-element-form.component';

describe('AddElementFormComponent', () => {
  let component: AddElementFormComponent;
  let fixture: ComponentFixture<AddElementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddElementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddElementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
