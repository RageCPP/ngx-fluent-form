import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { withAllWidgets } from '../features';
import { provideFluentForm } from '../provider';
import { FormUtil } from '../utils';
import { FluentControlPipe } from './control.pipe';

describe('FluentControlPipe', () => {
  let pipe: FluentControlPipe;
  let formGroup: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFluentForm(
          withAllWidgets()
        ),
        FluentControlPipe
      ]
    });

    pipe = TestBed.inject(FluentControlPipe);
    formGroup = TestBed.inject(FormUtil).createFormGroup([
      { kind: 'input', key: 'a' },
      { kind: 'date-range', key: ['b', 'c'] }
    ]);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('should be able to find the parent control', () => {
    it('pass in a undefined', () => {
      expect(pipe.transform(undefined, formGroup)).toBe(formGroup);
    });

    it('pass in a other key', () => {
      expect(pipe.transform('b', formGroup)).toBe(formGroup);
    });
  });

  it('should be able to find the control', () => {
    expect(pipe.transform('a', formGroup)).toBeTruthy();
  });

  it('should be able to find the control', () => {
    expect(pipe.transform(['b', 'c'], formGroup)).toBeTruthy();
  });
});
