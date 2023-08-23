import { TestBed } from '@angular/core/testing';
import { withAllWidgets } from '../features';
import { provideFluentForm } from '../provider';
import { AnySchema } from '../schemas';
import { FormUtil } from './form.utils';
import { ModelUtil } from './model.utils';

describe('ModelUtils', () => {
  let modelUtil: ModelUtil;
  let formUtil: FormUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFluentForm(
          withAllWidgets()
        )
      ]
    });

    modelUtil = TestBed.inject(ModelUtil);
    formUtil = TestBed.inject(FormUtil);
  });

  describe('updateForm', () => {
    it('group', () => {
      const schemas: AnySchema[] = [
        { kind: 'input', key: 'input' }
      ];
      const form = formUtil.createFormGroup(schemas, {});

      modelUtil.updateForm(form, {}, schemas);
      expect(form.value).toEqual({ input: null });

      modelUtil.updateForm(form, { input: 'input' }, schemas);
      expect(form.value).toEqual({ input: 'input' });
    });

    it('group nested group', () => {
      const schemas: AnySchema[] = [
        {
          kind: 'group',
          key: 'object',
          schemas: [
            { kind: 'input', key: 'input' }
          ]
        }
      ];
      const form = formUtil.createFormGroup(schemas, {});

      modelUtil.updateForm(form, {}, schemas);
      expect(form.value).toEqual({ object: { input: null } });

      modelUtil.updateForm(form, { object: { input: 'input' } }, schemas);
      expect(form.value).toEqual({ object: { input: 'input' } });
    });

    it('array', () => {
      const schemas: AnySchema[] = [
        {
          kind: 'array',
          key: 'array',
          schemas: [
            { kind: 'input' }
          ]
        }
      ];
      const form = formUtil.createFormGroup(schemas, {});

      modelUtil.updateForm(form, {}, schemas);
      expect(form.value).toEqual({ array: [] });

      modelUtil.updateForm(form, { array: ['input'] }, schemas);
      expect(form.value).toEqual({ array: ['input'] });

      modelUtil.updateForm(form, { array: ['text'] }, schemas);
      expect(form.value).toEqual({ array: ['text'] });
    });

    it('array nested array', () => {
      const schemas: AnySchema[] = [
        {
          kind: 'array',
          key: 'array',
          schemas: [
            {
              kind: 'array',
              schemas: [
                { kind: 'input' }
              ]
            }
          ]
        }
      ];
      const form = formUtil.createFormGroup(schemas, {});

      modelUtil.updateForm(form, {}, schemas);
      expect(form.value).toEqual({ array: [] });

      modelUtil.updateForm(form, { array: [] }, schemas);
      expect(form.value).toEqual({ array: [] });

      modelUtil.updateForm(form, { array: [[]] }, schemas);
      expect(form.value).toEqual({ array: [[]] });

      modelUtil.updateForm(form, { array: [['input']] }, schemas);
      expect(form.value).toEqual({ array: [['input']] });

      modelUtil.updateForm(form, { array: [['text']] }, schemas);
      expect(form.value).toEqual({ array: [['text']] });
    });

    it('array nested object', () => {
      const schemas: AnySchema[] = [
        {
          kind: 'array',
          key: 'array',
          schemas: [
            {
              kind: 'group',
              schemas: [
                { kind: 'input', key: 'input' }
              ]
            }
          ]
        }
      ];
      const form = formUtil.createFormGroup(schemas, {});

      modelUtil.updateForm(form, {}, schemas);
      expect(form.value).toEqual({ array: [] });

      modelUtil.updateForm(form, { array: [{}] }, schemas);
      expect(form.value).toEqual({ array: [{ input: null }] });

      modelUtil.updateForm(form, { array: [{ input: 'input' }] }, schemas);
      expect(form.value).toEqual({ array: [{ input: 'input' }] });
    });

    it('with double key control', () => {
      const schemas: AnySchema[] = [
        { kind: 'slider', key: ['start', 'end'] }
      ];
      const form = formUtil.createFormGroup(schemas, {});

      modelUtil.updateForm(form, {}, schemas);
      expect(form.value).toEqual({ 'start,end': null });

      modelUtil.updateForm(form, { start: 0, end: 100 }, schemas);
      expect(form.value).toEqual({ 'start,end': [0, 100] });
    });

    it('with control wrapper', () => {
      const schemas: AnySchema[] = [
        {
          kind: 'input-group',
          schemas: [
            { kind: 'input', key: 'input' },
          ]
        }
      ];
      const form = formUtil.createFormGroup(schemas, {});

      modelUtil.updateForm(form, {}, schemas);
      expect(form.value).toEqual({ input: null });

      modelUtil.updateForm(form, { input: 'input' }, schemas);
      expect(form.value).toEqual({ input: 'input' });
    });

    it('with component', () => {
      const schemas: AnySchema[] = [
        { kind: 'input', key: 'input' },
        { kind: 'button' }
      ];
      const form = formUtil.createFormGroup(schemas, {});

      modelUtil.updateForm(form, {}, schemas);
      expect(form.value).toEqual({ input: null });

      modelUtil.updateForm(form, { input: 'input' }, schemas);
      expect(form.value).toEqual({ input: 'input' });
    });

    it('with component wrapper', () => {
      const schemas: AnySchema[] = [
        { kind: 'input', key: 'input' },
        {
          kind: 'button-group',
          schemas: [
            { kind: 'button' }
          ]
        }
      ];
      const form = formUtil.createFormGroup(schemas, {});

      modelUtil.updateForm(form, {}, schemas);
      expect(form.value).toEqual({ input: null });

      modelUtil.updateForm(form, { input: 'input' }, schemas);
      expect(form.value).toEqual({ input: 'input' });
    });

    it('with component container', () => {
      const schemas: AnySchema[] = [
        {
          kind: 'row',
          schemas: [
            { kind: 'input', key: 'input' },
          ]
        }
      ];
      const form = formUtil.createFormGroup(schemas, {});

      modelUtil.updateForm(form, {}, schemas);
      expect(form.value).toEqual({ input: null });

      modelUtil.updateForm(form, { input: 'input' }, schemas);
      expect(form.value).toEqual({ input: 'input' });
    });
  });
});
