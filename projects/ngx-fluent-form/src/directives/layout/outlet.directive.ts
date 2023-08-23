import { Directive, inject, Input, OnChanges, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AnyArray, AnyObject } from '@ngify/types';
import { AnyComponentSchema, AnyControlSchema, SchemaKey } from '../../schemas';
import { TemplateRegistry } from '../../services';
import { WidgetTemplateContext } from '../../widgets';
import { FluentControlContainer } from './models/control-container';

// TODO
// 目前 fluent-outlet 渲染的组件是不支持显示验证状态/控件标签的，考虑将 fluent-outlet 改为组件，
// 内部把 nz-form-label 和 nz-form-control 渲染一下

@Directive({
  // eslint-disable-next-line
  selector: 'fluent-outlet,[fluentOutlet]',
  exportAs: 'fluentOutlet',
  standalone: true,
  host: {
    '[style.display]': `'none'`
  }
})
export class FluentOutletDirective<T extends AnyObject | AnyArray> implements OnInit, OnChanges, OnDestroy, WidgetTemplateContext<AnyComponentSchema | AnyControlSchema, AbstractControl> {
  private readonly registry = inject(TemplateRegistry);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly controlContainer: FluentControlContainer<T> = inject(FluentControlContainer<T>, { host: true, skipSelf: true });
  private _schema!: AnyComponentSchema | AnyControlSchema;

  /** @internal */
  set schema(value: AnyComponentSchema | AnyControlSchema) {
    this._schema = value;
    this.viewContainerRef.length && this.viewContainerRef.clear();
    this.viewContainerRef.createEmbeddedView(this.registry.get(value.kind), this);
  }
  /** @internal */
  get schema() {
    return this._schema;
  }
  /** @internal */
  control!: AbstractControl;
  /** @internal */
  get model() {
    return this.controlContainer.directive.model;
  }

  @Input() key!: SchemaKey;

  ngOnInit() {
    this.controlContainer.directive.addDirective(this);
  }

  ngOnChanges() {
    this.controlContainer.directive.assignDirective(this);
  }

  ngOnDestroy() {
    this.controlContainer.directive.removeDirective(this);
  }

}
