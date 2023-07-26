import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, Injector } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AnyObject } from '@ngify/types';
import { NzFormNoStatusService } from 'ng-zorro-antd/core/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Subject, tap } from 'rxjs';
import { FluentBindingDirective, FluentContextDirective, FluentContextGuardDirective, FluentInjectDirective, FluentLifeCycleDirective } from '../../directives';
import { FluentColumnPipe, FluentReactivePipe, TypeofPipe } from '../../pipes';
import { SelectControlSchema } from '../../schemas';
import { AbstractWidget, WidgetTemplateContext } from '../abstract.widget';

type SelectWidgetTemplateContext = WidgetTemplateContext<SelectControlSchema, FormControl>;

@Component({
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    NgStyle,
    ReactiveFormsModule,
    NzGridModule,
    NzSelectModule,
    FluentInjectDirective,
    FluentBindingDirective,
    FluentContextGuardDirective,
    FluentContextDirective,
    FluentLifeCycleDirective,
    FluentReactivePipe,
    FluentColumnPipe,
    TypeofPipe
  ],
  templateUrl: './select.widget.html',
  styles: [`nz-select { width: 100% }`]
})
export class SelectWidget extends AbstractWidget<SelectWidgetTemplateContext> {
  protected readonly NzFormNoStatusService = NzFormNoStatusService;
  protected readonly infinity = Infinity;
  protected readonly ctxClass = SelectWidgetTemplatePrivateContext;
}

export class SelectWidgetTemplatePrivateContext {
  private readonly keyword$ = new Subject<string>();
  private readonly cdr: ChangeDetectorRef;

  options: AnyObject[] = [];

  constructor(injector: Injector) {
    this.cdr = injector.get(ChangeDetectorRef);
  }

  init(schema: SelectControlSchema, model: AnyObject, control: FormControl) {
    const optionsOrFn = schema.options;

    if (Array.isArray(optionsOrFn)) {
      this.options = optionsOrFn;
    } else {
      this.keyword$.pipe(
        tap(() => schema.loading = true),
        source => optionsOrFn(source, { schema, model, control }),
      ).subscribe(options => {
        this.options = options;
        schema.loading = false;
        this.cdr.detectChanges();
      });
    }
  }

  destroy() {
    this.keyword$.complete();
  }

  trigger(keyword: string) {
    this.keyword$.next(keyword);
  }
}
