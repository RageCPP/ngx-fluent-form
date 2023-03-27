import { ValidatorFn, Validators } from '@angular/forms';
import { COMPONENT_CONTAINER_SCHEMA_KINDS, COMPONENT_SCHEMA_KINDS, COMPONENT_WRAPPER_SCHEMA_KINDS, CONTROL_CONTAINER_SCHEMA_KINDS, CONTROL_WRAPPER_SCHEMA_KINDS, TEXT_CONTROL_SCHEMA_KINDS } from '../constants';
import { InputControlSchema, TextareaControlSchema } from '../schemas';
import { AnyComponentContainerSchema, AnyComponentSchema, AnyComponentWrapperSchema, AnyContainerSchema, AnyControlContainerSchema, AnyControlOrControlContainerSchema, AnyControlSchema, AnyControlWrapperSchema, AnySchema, AnyWrapperSchema, DoubleKeyControlSchema } from '../schemas/index.schema';
import { AnySchemaName, SchemaName, StandardSchema } from '../schemas/types';
import { StableBuilder, isBuilder } from './builder.utils';
import { isNumber } from './is.utils';

/**
 * 是否为控件容器图示
 * @param schema
 */
export const isControlContainerSchema = (schema: AnySchema): schema is AnyControlContainerSchema =>
  CONTROL_CONTAINER_SCHEMA_KINDS.includes(schema.kind);

/**
 * 是否为控件包装器图示
 * @param schema
 */
export const isControlWrapperSchema = (schema: AnySchema): schema is AnyControlWrapperSchema =>
  CONTROL_WRAPPER_SCHEMA_KINDS.includes(schema.kind);

/**
 * 是否为组件容器图示
 * @param schema
 */
export const isComponentContainerSchema = (schema: AnySchema): schema is AnyComponentContainerSchema =>
  COMPONENT_CONTAINER_SCHEMA_KINDS.includes(schema.kind);

/**
 * 是否为组件包装器图示
 * @param schema
 */
export const isComponentWrapperSchema = (schema: AnySchema): schema is AnyComponentWrapperSchema =>
  COMPONENT_WRAPPER_SCHEMA_KINDS.includes(schema.kind);

/**
 * 是否为文本图示
 * @param schema
 */
export const isTextControlSchema = (schema: AnySchema): schema is InputControlSchema | TextareaControlSchema =>
  TEXT_CONTROL_SCHEMA_KINDS.includes(schema.kind);

/**
 * 是否为组件图示
 * @param schema
 */
export const isComponentSchema = (schema: AnySchema): schema is AnyComponentSchema =>
  COMPONENT_SCHEMA_KINDS.includes(schema.kind);

/**
 * 是否为双字段图示
 * @param schema
 */
export const isDoubleKeyControlSchema = (schema: AnySchema): schema is DoubleKeyControlSchema =>
  Array.isArray(schema.name);

/**
 * 标准化容器图示
 * @internal
 * @param schema
 */
const standardContainerSchema = <T extends AnyContainerSchema | AnyWrapperSchema>(schema: T): T => {
  const schemas = standardSchemas(schema.schemas);

  // 如果是数组表单图示，自动补充子图示的名称为索引值
  if (schema.kind === 'array') {
    schemas.forEach((schema, index) => schema.name = index);
  }

  schema.schemas = schemas;

  return schema;
};

/**
 * 标准化图示
 * @param schemaOrSchemaBuilder
 */
export function standardSchema<T extends AnySchema>(schemaOrSchemaBuilder: T | StableBuilder<T>): StandardSchema<T> {
  const schema = (isBuilder(schemaOrSchemaBuilder) ? schemaOrSchemaBuilder.build() : { ...schemaOrSchemaBuilder });

  if (
    isControlContainerSchema(schema) ||
    isControlWrapperSchema(schema) ||
    isComponentContainerSchema(schema) ||
    isComponentWrapperSchema(schema)
  ) {
    standardContainerSchema(schema);
  }

  switch (schema.kind) {
    case 'date':
    case 'time':
      schema.mapper ??= {
        input: (value: string | number | Date) => value ? new Date(value) : null,
        output: value => value?.getTime() ?? null
      };
      break;

    case 'date-range':
      schema.mapper ??= {
        input: (value: [string | number | Date, string | number | Date]) => value?.map(o => new Date(o)) as [Date, Date] ?? null,
        output: value => value?.map(o => o.getTime()) ?? null
      };
      break;

    case 'checkbox-group': {
      const labelProperty = schema.config?.labelProperty ?? 'label';
      const valueProperty = schema.config?.valueProperty ?? 'value';
      const options = schema.options;

      schema.mapper ??= {
        input: value => options.map(option => ({
          label: option[labelProperty],
          value: option[valueProperty],
          checked: !!value?.includes(option[valueProperty])
        })),
        output: value => value?.filter(o => o.checked).map(o => o.value)
      };
      break;
    }
  }

  return schema as StandardSchema<T>;
}

/**
 * 标准化所有图示
 * @param schemas
 */
export const standardSchemas = <T extends (AnySchema | StableBuilder<AnySchema>)[]>(schemas: T) =>
  schemas.map(schema => standardSchema(schema));

export function controlSchemaUtils<S extends AnyControlSchema>(schema: S) {
  return new ControlSchemaUtils(schema);
}

export class ControlSchemaUtils<S extends StandardSchema<AnyControlSchema>> {
  constructor(private readonly schema: S) { }

  /**
   * 根据部分图示提供的便捷验证参数获取额外的验证器
   * @returns
   */
  getExtraValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (this.schema.required === true) { // required 可能是个函数，需要动态
      validators.push(Validators.required);
    }

    if (this.schema.kind === 'input' && this.schema.type === 'email') {
      validators.push(Validators.email);
    }

    if (isTextControlSchema(this.schema) && this.schema.length) {
      if (isNumber(this.schema.length)) {
        validators.push(
          Validators.minLength(this.schema.length),
          Validators.maxLength(this.schema.length)
        );
      } else {
        const { min, max } = this.schema.length;

        min && validators.push(Validators.minLength(min));
        max && validators.push(Validators.maxLength(max));
      }
    }

    return validators;
  }
}

export function schemasUtils<S extends AnySchema[]>(schemas: S) {
  return new SchemasUtils(schemas);
}

export class SchemasUtils<S extends AnySchema[]> {
  constructor(private readonly schemas: S) { }

  find<T extends AnySchema>(name: AnySchemaName): T | null;
  find<T extends AnySchema>(path: [...SchemaName[], AnySchemaName]): T | null;
  find<T extends AnySchema>(path: AnySchemaName | [...SchemaName[], AnySchemaName]): T | null;
  find<T extends AnySchema>(path: AnySchemaName | [...SchemaName[], AnySchemaName]): T | null {
    let schemas = this.schemas as AnySchema[];
    // 如果是数组，那么除了最后一个元素，其他元素所对应的 schema 一定是 container schema
    if (Array.isArray(path)) {
      const [endPath, ...beforePath] = path.reverse() as [AnySchemaName, ...SchemaName[]];
      schemas = beforePath.reduceRight((schemas, name) => (
        (schemas.find(o => o.name === name) as AnyContainerSchema).schemas as AnyControlOrControlContainerSchema[]
      ), schemas as AnyControlOrControlContainerSchema[]);
      path = endPath;
    }

    return (schemas.find(o => {
      // 处理双字段模式
      if (Array.isArray(o.name) && Array.isArray(path)) {
        return arraysEqual(o.name, path);
      }

      return o.name === path;
    }) ?? null) as T | null;
  }
}

/** @internal */
function arraysEqual(a: unknown[], b: unknown[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}
