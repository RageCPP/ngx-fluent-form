import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FluentFormColContentOutletComponent } from '../../components';
import { FluentBindingDirective, FluentConfigDirective, FluentContextGuardDirective } from '../../directives';
import { FluentColumnPipe, FluentReactivePipe, InvokePipe } from '../../pipes';
import { FormArraySchema, StandardSchema } from '../../schemas';
import { FormUtil, isNumber, isUndefined, SchemaUtil } from '../../utils';
import { AbstractWidget, WidgetTemplateContext } from '../abstract.widget';

type FormArrayWidgetTemplateContext = WidgetTemplateContext<FormArraySchema, FormArray>;

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    NgStyle,
    NgTemplateOutlet,
    NzGridModule,
    NzFormModule,
    NzButtonModule,
    NzDividerModule,
    NzIconModule,
    NzOutletModule,
    FluentFormColContentOutletComponent,
    FluentBindingDirective,
    FluentContextGuardDirective,
    FluentConfigDirective,
    FluentColumnPipe,
    FluentReactivePipe,
    InvokePipe
  ],
  templateUrl: './form-array.widget.html'
})
export class FormArrayWidget extends AbstractWidget<FormArrayWidgetTemplateContext> {
  private readonly schemaUtil = inject(SchemaUtil);
  private readonly formUtil = inject(FormUtil);

  protected push(control: FormArray, schema: StandardSchema<FormArraySchema>) {
    const [elementSchema] = this.schemaUtil.filterControlSchemas(schema.schemas);

    control.push(
      this.formUtil.createAnyControl(elementSchema, {})
    );
  }

  protected readonly helper = {
    length: {
      min: (length: FormArraySchema['length']) =>
        isNumber(length) ? length : length?.min ?? 0,
      max: (length: FormArraySchema['length']) =>
        isNumber(length) ? length : length?.max ?? Infinity,
    },
    addable: (addable: FormArraySchema['addable']): NonBoolean<FormArraySchema['addable']> | false => {
      if (addable === true || isUndefined(addable)) {
        return { type: 'dashed', icon: 'plus', variants: { block: true } };
      }

      return addable;
    }
  } as const;
}

type NonBoolean<T> = T extends boolean ? never : T;
