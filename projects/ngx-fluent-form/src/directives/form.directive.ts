import { Directive, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { takeUntil } from 'rxjs';
import { group } from '../builders';
import { AnySchema, ComponentSchema, ControlSchema, FormGroupSchema } from '../schemas';
import { AnyArray, AnyObject } from '../types';
import { createFormGroup, formUtils, FormUtils, modelUtils, schemasUtils, standardSchema } from '../utils';
import { FluentFormNameDirective } from './form-name.directive';
import { ControlContainer } from './models/control-container';
import { FluentOutletDirective } from './outlet.directive';

@Directive({
  selector: '[fluentForm]',
  exportAs: 'fluentForm',
  providers: [
    NzDestroyService,
    {
      provide: ControlContainer,
      useExisting: forwardRef(() => FluentFormDirective)
    }
  ]
})
export class FluentFormDirective<T extends AnyObject | AnyArray> extends ControlContainer<T> implements OnChanges {
  private _model!: T;
  private directives: FluentOutletDirective<T>[] = [];

  override form!: FormGroup;
  /** @internal */
  schema!: FormGroupSchema;

  override get schemas(): AnySchema[] {
    return this.schema?.schemas as AnySchema[];
  }

  @Input('fluentForm')
  override set schemas(value: AnySchema[] | FormGroupSchema) {
    // 这里统一包装为 FormGroupSchema
    this.schema = standardSchema(
      Array.isArray(value) ? group().schemas(...value) : standardSchema(value)
    );

    this.formChange.emit(this.form = createFormGroup(this.schema));
  }

  /** 模型 */
  @Input('fluentModel') override model!: T;

  @Output() formChange: EventEmitter<FormGroup> = new EventEmitter();
  @Output() modelChange: EventEmitter<T> = new EventEmitter();

  get directive(): FluentFormDirective<T> | FluentFormNameDirective<T> {
    return this;
  }

  constructor(private destroy$: NzDestroyService) {
    super();
  }

  ngOnChanges({ schemas: schemasChange, model: modelChange }: SimpleChanges): void {
    if (schemasChange) {
      schemasChange.firstChange || this.destroy$.next();

      this.directives.forEach(directive => this.assignDirective(directive));

      const utils = formUtils(this.form, this.schemas);

      this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.onValueChanges(utils);
      });
      // 使用模型初始化表单
      modelUtils(this.model as AnyObject, this.schemas).assign(this.form);
    }

    // 如果是首次变更（首次的初始化已在上面处理了）
    // 并且当前模型值与内部的模型值不一致
    if (modelChange && !modelChange.firstChange && modelChange.currentValue !== this._model) {
      modelUtils(this.model as AnyObject, this.schemas).assign(this.form);
    }
  }

  /**
   * 添加子指令
   * @param directive
   */
  addDirective(directive: FluentOutletDirective<T>) {
    this.assignDirective(directive);
    this.directives = this.directives.concat(directive);
  }

  /**
   * 分配参数到子指令
   * @param directive
   */
  assignDirective(directive: FluentOutletDirective<T>) {
    directive.control = this.form.get([directive.name]) ?? this.form;
    directive.schema = schemasUtils(this.schemas).find<ComponentSchema | ControlSchema>(directive.name)!;
  }

  /**
   * 移除子指令
   * @param directive
   */
  removeDirective(directive: FluentOutletDirective<T>) {
    this.directives = this.directives.filter(o => o !== directive);
  }

  /**
   * 更新模型
   * @param utils
   */
  private onValueChanges(utils: FormUtils<FormGroup | FormArray>) {
    utils.assign(this.model);
    utils.change(this.model);
    this.modelChange.emit(this._model = utils.assign({} as T));
  }
}
