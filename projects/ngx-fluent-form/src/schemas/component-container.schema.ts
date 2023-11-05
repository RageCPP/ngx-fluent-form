import { TemplateRef } from '@angular/core';
import { NzSizeDSType, NzSizeLDSType } from 'ng-zorro-antd/core/types';
import { NzSpaceAlign, NzSpaceComponent, NzSpaceDirection, NzSpaceSize } from 'ng-zorro-antd/space';
import { NzStatusType, NzStepComponent, NzStepsComponent } from 'ng-zorro-antd/steps';
import { NzTabComponent, NzTabPosition, NzTabSetComponent, NzTabType } from 'ng-zorro-antd/tabs';
import { AbstractSchema } from './abstract.schema';
import { AnySchema } from './index.schema';
import { ComponentEventListenerHolder, ComponentPropertyHolder, ElementEventListenerHolder, ElementPropertyHolder, Row, SchemaReactiveFn } from './interfaces';
import { SchemaKey } from './types';

/**
 * @public
 */
export interface StepsComponentSchema<Key extends SchemaKey = SchemaKey>
  extends AbstractSchema<Key>, ComponentEventListenerHolder<NzStepsComponent>, ComponentPropertyHolder<NzStepsComponent> {
  kind: 'steps';
  type?: 'default' | 'navigation';
  active?: number;
  placement?: 'vertical' | 'horizontal';
  dot?: boolean;
  size?: NzSizeDSType;
  status?: NzStatusType;
  start?: number;
  schemas: StepComponentSchema[];
}

/**
 * @public
 */
export interface StepComponentSchema<Key extends SchemaKey = SchemaKey>
  extends AbstractSchema<Key>, ComponentEventListenerHolder<NzStepComponent>, ComponentPropertyHolder<NzStepComponent> {
  kind: 'step';
  title: string | TemplateRef<void>;
  subtitle?: string | TemplateRef<void>;
  description?: string | TemplateRef<void>;
  disabled?: boolean | string | SchemaReactiveFn<StepComponentSchema<SchemaKey>, boolean>;
  status?: 'wait' | 'process' | 'finish' | 'error';
  schemas: AnySchema[];
}

/**
 * @public
 */
export interface TabsComponentSchema<Key extends SchemaKey = SchemaKey>
  extends AbstractSchema<Key>, ComponentEventListenerHolder<NzTabSetComponent>, ComponentPropertyHolder<NzTabSetComponent> {
  kind: 'tabs';
  type?: NzTabType;
  active?: number;
  animate?: boolean;
  size?: NzSizeLDSType;
  position?: NzTabPosition;
  gutter?: number;
  center?: boolean;
  schemas: TabComponentSchema[];
}

/**
 * @public
 */
export interface TabComponentSchema<Key extends SchemaKey = SchemaKey>
  extends AbstractSchema<Key>, ComponentEventListenerHolder<NzTabComponent>, ComponentPropertyHolder<NzTabComponent> {
  kind: 'tab';
  title: string;
  disabled?: boolean | string | SchemaReactiveFn<TabComponentSchema<SchemaKey>, boolean>;
  schemas: AnySchema[];
}

/**
 * @public
 */
export interface RowComponentSchema<Key extends SchemaKey = SchemaKey>
  extends AbstractSchema<Key>, ElementEventListenerHolder, ElementPropertyHolder<HTMLElement>, Row {
  kind: 'row';
  schemas: AnySchema[];
}

/**
 * @public
 */
export interface SpaceComponentSchema<Key extends SchemaKey = SchemaKey>
  extends AbstractSchema<Key>, ComponentEventListenerHolder<NzSpaceComponent>, ComponentPropertyHolder<NzSpaceComponent> {
  kind: 'space';
  size?: NzSpaceSize;
  direction?: NzSpaceDirection;
  align?: NzSpaceAlign;
  wrapable?: boolean;
  split?: NzSpaceComponent['nzSplit'];
  schemas: AnySchema[];
}
