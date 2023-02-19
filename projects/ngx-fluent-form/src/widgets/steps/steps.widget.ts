import { NgClass, NgFor, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { FluentFormColContentOutletComponent } from '../../components';
import { FluentBinderDirective, FluentConfigDirective, FluentWithContextGuardDirective } from '../../directives';
import { FluentCallPipe, FluentControlPipe } from '../../pipes';
import { FluentInvokePipe } from '../../pipes/invoke.pipe';
import { StepsComponentSchema } from '../../schemas';
import { AbstractWidget, COL_HELPER, WidgetTemplateContext } from '../abstract.widget';

type StepsWidgetTemplateContext = WidgetTemplateContext<StepsComponentSchema, FormGroup>;

@Component({
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    NgStyle,
    NgTemplateOutlet,
    NzStepsModule,
    NzGridModule,
    FluentFormColContentOutletComponent,
    FluentBinderDirective,
    FluentConfigDirective,
    FluentWithContextGuardDirective,
    FluentCallPipe,
    FluentControlPipe,
    FluentInvokePipe
  ],
  templateUrl: './steps.widget.html',
})
export class StepsWidget extends AbstractWidget<StepsWidgetTemplateContext> {
  protected readonly helper = { col: COL_HELPER } as const;
}
