import { Directive, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { AnyObject } from '@ngify/types';
import { NzFormNoStatusService } from 'ng-zorro-antd/core/form';
import { AbstractSchema, AbstractTextControlSchema } from '../schemas';
import { isNumber } from '../utils';

export interface WidgetTemplateContext<S extends AbstractSchema, C extends AbstractControl = FormControl> {
  schema: S;
  control: C;
  model: AnyObject;
}

/**
 * @internal
 */
@Directive()
export abstract class AbstractWidget<C> {
  protected readonly contextGuard!: C;
  @ViewChild(TemplateRef, { static: true }) templateRef!: TemplateRef<C>;
}

export abstract class AbstractTextControlWidget<C> extends AbstractWidget<C> {
  protected readonly InputGroup = NzFormNoStatusService;
  protected readonly helper = {
    length: {
      min: (length: AbstractTextControlSchema['length']) => {
        return isNumber(length) ? length : length?.min;
      },
      max: (length: AbstractTextControlSchema['length']) => {
        return isNumber(length) ? length : length?.max;
      },
    }
  } as const;
}
