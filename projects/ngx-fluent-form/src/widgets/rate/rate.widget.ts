import { NgClass, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { FluentBinderDirective, FluentWithContextGuardDirective } from '../../directives';
import { RateControlSchema } from '../../schemas';
import { AbstractWidget, WidgetTemplateContext } from '../abstract.widget';

type RateWidgetTemplateContext = WidgetTemplateContext<RateControlSchema, FormControl<number>>;

@Component({
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    ReactiveFormsModule,
    NzRateModule,
    FluentBinderDirective,
    FluentWithContextGuardDirective,
  ],
  templateUrl: './rate.widget.html',
})
export class RateWidget extends AbstractWidget<RateWidgetTemplateContext> { }
