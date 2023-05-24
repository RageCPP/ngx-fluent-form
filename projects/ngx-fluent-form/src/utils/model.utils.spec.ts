import { TestBed } from '@angular/core/testing';
import { AnySchema } from '../schemas';
import { StandardSchema } from '../schemas/types';
import { createFormGroup } from './form.utils';
import { ModelUtil } from './model.utils';

describe('ModelUtils', () => {
  let util: ModelUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    util = TestBed.inject(ModelUtil);
  });

  it('with headless control', () => {
    const schemas: StandardSchema<AnySchema>[] = [{ kind: 'headless', key: 'headless' }];
    const form = createFormGroup(schemas);
    const model = {};

    expect(util.updateForm(model, schemas, form).value).toEqual({ headless: null });
  });

  it('with control', () => {
    const schemas: StandardSchema<AnySchema>[] = [{ kind: 'number', key: 'num' }];
    const form = createFormGroup(schemas);
    const model = { num: 1 };

    expect(util.updateForm(model, schemas, form).value).toEqual({ num: 1 });
  });

  it('with double key control', () => {
    const schemas: StandardSchema<AnySchema>[] = [{ kind: 'slider', key: ['start', 'end'] }];
    const form = createFormGroup(schemas);
    const model = { start: 0, end: 100 };

    expect(util.updateForm(model, schemas, form).value).toEqual({ 'start,end': [0, 100] });
  });

  it('with component', () => {
    const schemas: StandardSchema<AnySchema>[] = [{ kind: 'button' }];
    const form = createFormGroup(schemas);
    const model = {};

    expect(util.updateForm(model, schemas, form).value).toEqual({});
  });

  it('with component wrapper', () => {
    const schemas: StandardSchema<AnySchema>[] = [{ kind: 'button-group', schemas: [] }];
    const form = createFormGroup(schemas);
    const model = {};

    expect(util.updateForm(model, schemas, form).value).toEqual({});
  });

  it('with template', () => {
    const schemas: StandardSchema<AnySchema>[] = [{ kind: 'template' }];
    const form = createFormGroup(schemas);
    const model = {};

    expect(util.updateForm(model, schemas, form).value).toEqual({});
  });

  it('with group (empty)', () => {
    const schemas: StandardSchema<AnySchema>[] = [
      {
        kind: 'group',
        key: 'obj',
        schemas: []
      }
    ];
    const form = createFormGroup(schemas);
    const model = { obj: {} };

    expect(util.updateForm(model, schemas, form).value).toEqual({ obj: {} });
  });

  it('with group', () => {
    const schemas: StandardSchema<AnySchema>[] = [
      {
        kind: 'group',
        key: 'obj',
        schemas: [
          { kind: 'number', key: 'num' }
        ]
      }
    ];
    const form = createFormGroup(schemas);
    const model = { obj: { num: 1 } };

    expect(util.updateForm(model, schemas, form).value).toEqual({ obj: { num: 1 } });
  });

  it('with array (empty)', () => {
    const schemas: StandardSchema<AnySchema>[] = [
      {
        kind: 'array',
        key: 'arr',
        schemas: []
      }
    ];
    const form = createFormGroup(schemas);
    const model = { arr: [] };

    expect(util.updateForm(model, schemas, form).value).toEqual({ arr: [] });
  });

  it('with array', () => {
    const schemas: StandardSchema<AnySchema>[] = [
      {
        kind: 'array',
        key: 'arr',
        schemas: [
          { kind: 'number', key: 0 }
        ]
      }
    ];
    const form = createFormGroup(schemas);
    const model = { arr: [1] };

    expect(util.updateForm(model, schemas, form).value).toEqual({ arr: [1] });
  });

  it('with mix', () => {
    const schemas: StandardSchema<AnySchema>[] = [
      {
        kind: 'group',
        key: 'obj',
        schemas: [
          {
            kind: 'array',
            key: 'arr',
            schemas: [
              { kind: 'number', key: 0 }
            ]
          }
        ]
      },
      {
        kind: 'array',
        key: 'arr',
        schemas: [
          {
            kind: 'group',
            key: 0,
            schemas: [
              { kind: 'number', key: 'num' }
            ]
          },
        ]
      }
    ];
    const form = createFormGroup(schemas);
    const model = {
      obj: { arr: [1] },
      arr: [{ num: 1 }]
    };

    expect(util.updateForm(model, schemas, form).value).toEqual({
      obj: { arr: [1] },
      arr: [{ num: 1 }]
    });
  });
});
