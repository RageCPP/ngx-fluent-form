import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { AnyObject, SafeAny } from '@ngify/types';
import { form, group, input } from '../../compose';
import { withAllWidgets, withStaticExpression } from '../../features';
import { provideFluentForm } from '../../provider';
import { FormGroupSchema } from '../../schemas';
import { queueMicrotask } from '../../shared';
import { FluentFormComponent } from './form.component';

@Component({
  standalone: true,
  imports: [FluentFormComponent],
  template: `<fluent-form [schema]="schema" [(model)]="model" (formChange)="form = $event"></fluent-form>`,
})
class TestComponent<T extends AnyObject> {
  form!: FormGroup;
  schema!: FormGroupSchema;
  model: T = {} as T;
}

describe('FluentFormComponent', () => {
  let component: TestComponent<{}>;
  let fixture: ComponentFixture<TestComponent<{}>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFluentForm(
          withAllWidgets(),
          withStaticExpression()
        )
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('应该能创建组件', () => {
    expect(component).toBeTruthy();
  });

  it('能够配置顶层表单', async () => {
    component.schema = form(
      group().updateOn('blur').schemas(() => {
        input('text');
      })
    );
    component.model = {};
    fixture.detectChanges();

    await queueMicrotask(() => {
      expect(component.model).toEqual({ text: null });
    });
  });

  describe('模型应该能正确赋值表单', () => {
    it('先设置 schema，后设置 model', () => {
      component.schema = form(() => input('text'));
      component.model = { text: 'test' };
      fixture.detectChanges();

      expect(component.form.value).toEqual({ text: 'test' });
    });

    it('先设置 model，后设置 schema', () => {
      component.model = { text: 'test' };
      component.schema = form(() => input('text'));
      fixture.detectChanges();

      expect(component.form.value).toEqual({ text: 'test' });
    });

    it('多次设置 model', async () => {
      component.schema = form(() => input('text'));
      component.model = { text: 'test' };
      fixture.detectChanges();

      await queueMicrotask(() => {
        expect(component.form.value).toEqual({ text: 'test' });
      });

      component.model = { text: 'test change' };
      fixture.detectChanges();

      await queueMicrotask(() => {
        expect(component.form.value).toEqual({ text: 'test change' });
      });
    });
  });

  describe('表单应该能正确赋值模型', () => {
    it('先设置 schema，后设置 model', async () => {
      component.schema = form(() => {
        input('text').col(1).defaultValue('test');
      });
      component.model = {};
      fixture.detectChanges();

      await queueMicrotask(() => {
        expect(component.model).toEqual({ text: 'test' });
      });
    });

    it('先设置 model，后设置 schema', async () => {
      component.model = {};
      component.schema = form(() => {
        input('text').col(1).defaultValue('test');
      });
      fixture.detectChanges();

      await queueMicrotask(() => {
        expect(component.model).toEqual({ text: 'test' });
      });
    });

    it('多次设置 schema', async () => {
      component.model = {};
      component.schema = form(() => {
        input('text').col(1).defaultValue('test');
      });
      fixture.detectChanges();

      await queueMicrotask(() => {
        expect(component.model).toEqual({ text: 'test' });
      });

      component.schema = form(() => {
        input('text').col(1).defaultValue('test change');
      });
      fixture.detectChanges();

      await queueMicrotask(() => {
        expect(component.model).toEqual({ text: 'test' });
      });
    });
  });

  it('应该能正确处理控件的 disabled 选项', async () => {
    component.schema = form(() => {
      input('a').disabled('{{true}}' as SafeAny);
      input('b').disabled(() => true);
      input('c').disabled(true);
    });
    component.model = {};
    fixture.detectChanges();

    await queueMicrotask(() => {
      expect(component.form.get('a')!.disabled).toEqual(true);
      expect(component.form.get('b')!.disabled).toEqual(true);
      expect(component.form.get('c')!.disabled).toEqual(true);
    });
  });
});
