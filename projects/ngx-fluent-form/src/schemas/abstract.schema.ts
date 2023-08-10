import { NgClass, NgStyle } from '@angular/common';
import { TemplateRef } from '@angular/core';
import { AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';
import { SafeAny } from '@ngify/types';
import { AutocompleteDataSource } from 'ng-zorro-antd/auto-complete';
import { CompareWith, NzSizeLDSType } from 'ng-zorro-antd/core/types';
import { NzDateMode, SupportTimeOptions } from 'ng-zorro-antd/date-picker';
import { NzPlacement } from 'ng-zorro-antd/date-picker/date-picker.component';
import { AnyBuilder, AnySchema } from './index.schema';
import { Col, ControlEventListenerHolder, ControlValueMapper, Labelful, Length, Row, SchemaLike, SchemaReactiveFn } from './interfaces';
import { AnySchemaKey, Cell } from './types';

/** 抽象图示 */
export interface AbstractSchema<Key extends AnySchemaKey = AnySchemaKey> extends SchemaLike<Key> {
  /* Used to define the width of the control. */
  col?: Col | Cell;
  hidden?: boolean | string | SchemaReactiveFn<AbstractSchema, boolean>;
  class?: NgClass['ngClass'];
  style?: NgStyle['ngStyle'];
}

/** 抽象的真实控件图示 */
export interface AbstractControlSchema<Key extends AnySchemaKey, Val> extends AbstractSchema<Key>, Labelful {
  id?: string;
  /** I/O mapper for control */
  mapper?: ControlValueMapper<Val>;
  /* Used to set the default value of the control. */
  defaultValue?: SafeAny;
  /** Is it a required control */
  required?: boolean | string | SchemaReactiveFn<AbstractControlSchema<AnySchemaKey, Val>, boolean>;
  /** Whether to disable control */
  disabled?: boolean | string | SchemaReactiveFn<AbstractControlSchema<AnySchemaKey, Val>, boolean>;
  feedback?: boolean;
  hint?: string | TemplateRef<void>;
  /** Error message for control */
  tips?: {
    success?: string | TemplateRef<{ $implicit: FormControl<Val> }>;
    warning?: string | TemplateRef<{ $implicit: FormControl<Val> }>;
    error?: string | TemplateRef<{ $implicit: FormControl<Val> }>;
    validating?: string | TemplateRef<{ $implicit: FormControl<Val> }>;
    auto?: Record<'default' | (string & {}), Record<string, string>>;
  };
  /** Validator for the control */
  validators?: ValidatorFn[];
  /** Async validators for control */
  asyncValidators?: AsyncValidatorFn[];
  /** The event name for control to update upon. */
  updateOn?: AbstractControlOptions['updateOn'];
}

/** 抽象的容器控件图示 */
export interface AbstractControlContainerSchema<Key extends AnySchemaKey> extends AbstractSchema<Key>, ControlEventListenerHolder<SafeAny>, Row {
  /* Used to define the label of the control. */
  label?: string;
  schemas: (AnySchema | AnyBuilder)[];
  /** Validator for the control */
  validators?: ValidatorFn[];
  /** Async validators for control */
  asyncValidators?: AsyncValidatorFn[];
  /** The event name for control to update upon. */
  updateOn?: AbstractControlOptions['updateOn'];
}

/** 抽象的输入框图示 */
export interface AbstractInputBoxControlSchema<Key extends AnySchemaKey, Val, P extends string | [string, string] = string> extends AbstractControlSchema<Key, Val> {
  placeholder?: P;
  autofocus?: boolean;
  readonly?: boolean | string | SchemaReactiveFn<AbstractInputBoxControlSchema<AnySchemaKey, Val, P>, boolean>;
  size?: NzSizeLDSType;
  borderless?: boolean;
}

/** 抽象的文本控件图示 */
export interface AbstractTextControlSchema<Key extends AnySchemaKey = AnySchemaKey> extends AbstractInputBoxControlSchema<Key, string> {
  length?: Length;
  autocomplete?: {
    backfill?: boolean;
    options: AutocompleteDataSource;
    width?: number;
    compare?: CompareWith;
  };
}

/** 抽象的日期控件图示 */
export interface AbstractDateControlSchema<Key extends AnySchemaKey, Val, P extends string | [string, string] = string> extends AbstractInputBoxControlSchema<Key, Val, P> {
  /** Mode of date picker control */
  mode?: NzDateMode;
  /** Show clean button */
  clearable?: boolean;
  /** Show time picker in date picker */
  time?: boolean | SupportTimeOptions;
  /** Date display format */
  format?: string;
  /** Inline mode */
  inline?: boolean;
  backdrop?: boolean;
  placement?: NzPlacement;
  today?: boolean;
  now?: boolean;
  suffixIcon?: string | TemplateRef<void>;
}
